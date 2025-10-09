-- =====================================================
-- API Usage Tracking Table
-- =====================================================
-- এই table user দের API usage track করার জন্য
-- Address generator এবং Email2Name API এর জন্য

CREATE TABLE IF NOT EXISTS public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_type TEXT NOT NULL CHECK (api_type IN ('address_generator', 'email2name')),
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_count INTEGER NOT NULL DEFAULT 0,
  daily_limit INTEGER NOT NULL DEFAULT 200,
  is_unlimited BOOLEAN DEFAULT FALSE,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per API per day
  UNIQUE(user_id, api_type, usage_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS api_usage_user_date_idx ON public.api_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS api_usage_api_type_idx ON public.api_usage(api_type);
CREATE INDEX IF NOT EXISTS api_usage_date_idx ON public.api_usage(usage_date);

-- Enable Row Level Security
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own API usage"
  ON public.api_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage"
  ON public.api_usage FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update API usage"
  ON public.api_usage FOR UPDATE
  USING (true);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_api_usage_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER on_api_usage_updated
  BEFORE UPDATE ON public.api_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_api_usage_updated_at();

-- Grant permissions
GRANT ALL ON public.api_usage TO authenticated;
GRANT ALL ON public.api_usage TO anon;

-- =====================================================
-- API User Limits Table
-- =====================================================
-- এই table admin দের user specific limits set করার জন্য

CREATE TABLE IF NOT EXISTS public.api_user_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_type TEXT NOT NULL CHECK (api_type IN ('address_generator', 'email2name')),
  daily_limit INTEGER NOT NULL DEFAULT 200,
  is_unlimited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- One limit setting per user per API
  UNIQUE(user_id, api_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS api_user_limits_user_idx ON public.api_user_limits(user_id);
CREATE INDEX IF NOT EXISTS api_user_limits_api_type_idx ON public.api_user_limits(api_type);

-- Enable RLS
ALTER TABLE public.api_user_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own limits"
  ON public.api_user_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all limits"
  ON public.api_user_limits FOR ALL
  USING (true); -- Admin check করা হবে application layer এ

-- Trigger for updated_at
CREATE TRIGGER on_api_user_limits_updated
  BEFORE UPDATE ON public.api_user_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_api_usage_updated_at();

-- Grant permissions
GRANT ALL ON public.api_user_limits TO authenticated;
GRANT ALL ON public.api_user_limits TO anon;

-- =====================================================
-- API Request Logs Table (Optional - for detailed tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_type TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS api_request_logs_user_date_idx ON public.api_request_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS api_request_logs_api_type_idx ON public.api_request_logs(api_type);
CREATE INDEX IF NOT EXISTS api_request_logs_success_idx ON public.api_request_logs(success);

-- Enable RLS
ALTER TABLE public.api_request_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own logs"
  ON public.api_request_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert logs"
  ON public.api_request_logs FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.api_request_logs TO authenticated;
GRANT ALL ON public.api_request_logs TO anon;

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to get or create daily usage record
CREATE OR REPLACE FUNCTION public.get_or_create_daily_usage(
  p_user_id UUID,
  p_api_type TEXT,
  p_usage_date DATE DEFAULT CURRENT_DATE
)
RETURNS public.api_usage
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_usage_record api_usage;
  v_user_limit api_user_limits;
  v_default_limit INTEGER := 200;
BEGIN
  -- Try to get existing record
  SELECT * INTO v_usage_record
  FROM api_usage
  WHERE user_id = p_user_id
    AND api_type = p_api_type
    AND usage_date = p_usage_date;
  
  -- If record exists, return it
  IF FOUND THEN
    RETURN v_usage_record;
  END IF;
  
  -- Get user specific limit if exists
  SELECT * INTO v_user_limit
  FROM api_user_limits
  WHERE user_id = p_user_id
    AND api_type = p_api_type;
  
  -- Use user specific limit or default
  IF FOUND THEN
    v_default_limit := v_user_limit.daily_limit;
  END IF;
  
  -- Create new record
  INSERT INTO api_usage (user_id, api_type, usage_date, daily_count, daily_limit, is_unlimited)
  VALUES (p_user_id, p_api_type, p_usage_date, 0, v_default_limit, COALESCE(v_user_limit.is_unlimited, FALSE))
  RETURNING * INTO v_usage_record;
  
  RETURN v_usage_record;
END;
$$;

-- Function to increment API usage
CREATE OR REPLACE FUNCTION public.increment_api_usage(
  p_user_id UUID,
  p_api_type TEXT,
  p_usage_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_usage_record api_usage;
  v_result JSONB;
BEGIN
  -- Get or create usage record
  SELECT * INTO v_usage_record
  FROM get_or_create_daily_usage(p_user_id, p_api_type, p_usage_date);
  
  -- Check if user has unlimited access
  IF v_usage_record.is_unlimited THEN
    -- Update last used time
    UPDATE api_usage
    SET last_used_at = NOW()
    WHERE id = v_usage_record.id;
    
    RETURN jsonb_build_object(
      'success', TRUE,
      'unlimited', TRUE,
      'daily_count', v_usage_record.daily_count,
      'daily_limit', v_usage_record.daily_limit,
      'remaining', 'unlimited'
    );
  END IF;
  
  -- Check if limit exceeded
  IF v_usage_record.daily_count >= v_usage_record.daily_limit THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'unlimited', FALSE,
      'daily_count', v_usage_record.daily_count,
      'daily_limit', v_usage_record.daily_limit,
      'remaining', 0,
      'error', 'Daily limit exceeded'
    );
  END IF;
  
  -- Increment usage count
  UPDATE api_usage
  SET daily_count = daily_count + 1,
      last_used_at = NOW()
  WHERE id = v_usage_record.id
  RETURNING daily_count, daily_limit INTO v_usage_record.daily_count, v_usage_record.daily_limit;
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'unlimited', FALSE,
    'daily_count', v_usage_record.daily_count,
    'daily_limit', v_usage_record.daily_limit,
    'remaining', v_usage_record.daily_limit - v_usage_record.daily_count
  );
END;
$$;

-- =====================================================
-- Sample Data (Optional)
-- =====================================================

-- Insert sample admin user limits (comment out if not needed)
-- INSERT INTO api_user_limits (user_id, api_type, daily_limit, is_unlimited)
-- SELECT 
--   (SELECT id FROM auth.users LIMIT 1),
--   'address_generator',
--   500,
--   FALSE
-- WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1)
-- ON CONFLICT (user_id, api_type) DO NOTHING;

-- =====================================================
-- END OF SCRIPT
-- =====================================================
