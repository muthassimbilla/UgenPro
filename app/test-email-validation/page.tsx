"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, TestTube } from "lucide-react"
import { EmailUtils } from "@/lib/auth-client"

export default function TestEmailValidationPage() {
  const [testEmail, setTestEmail] = useState("")
  const [result, setResult] = useState<{ isValid: boolean; errors: string[] } | null>(null)

  const testEmails = [
    "pat.ho.rporo.sh5.5@gmail.com",
    "test.user123@gmail.com",
    "john.doe@gmail.com",
    "user.name.last@gmail.com",
    "normal.email@gmail.com",
    "test..double.dot@gmail.com",
    "user@tempmail.org",
    "valid.email@gmail.com",
    "suspicious.pattern@gmail.com",
    "random.letters.here@gmail.com"
  ]

  const handleTest = () => {
    if (!testEmail.trim()) {
      setResult({ isValid: false, errors: ["Please enter an email to test"] })
      return
    }

    const validation = EmailUtils.validateEmail(testEmail)
    setResult(validation)
  }

  const handleTestPreset = (email: string) => {
    setTestEmail(email)
    const validation = EmailUtils.validateEmail(email)
    setResult(validation)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Email Validation Test
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test email validation rules and suspicious pattern detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Email Validation
              </CardTitle>
              <CardDescription>
                Enter an email address to test validation rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email to test..."
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleTest} className="w-full">
                Test Email
              </Button>

              {/* Result */}
              {result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {result.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Badge variant={result.isValid ? "default" : "destructive"}>
                      {result.isValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                  {result.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {result.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preset Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Preset Test Cases</CardTitle>
              <CardDescription>
                Click on any email to test validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testEmails.map((email, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleTestPreset(email)}
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono">{email}</code>
                      <Badge 
                        variant={EmailUtils.validateEmail(email).isValid ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {EmailUtils.validateEmail(email).isValid ? "Valid" : "Blocked"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Rules */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Validation Rules</CardTitle>
            <CardDescription>
              Email addresses are blocked if they match these patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">Blocked Patterns:</h4>
                <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• Multiple consecutive dots (..)</li>
                  <li>• Numbers in username part</li>
                  <li>• Too many dots in username</li>
                  <li>• Random character patterns</li>
                  <li>• Suspicious combinations (ho, hi, he, ha)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600">Blocked Domains:</h4>
                <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• 10minutemail.com</li>
                  <li>• tempmail.org</li>
                  <li>• guerrillamail.com</li>
                  <li>• mailinator.com</li>
                  <li>• yopmail.com</li>
                  <li>• temp-mail.org</li>
                  <li>• throwaway.email</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
