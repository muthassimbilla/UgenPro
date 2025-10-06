"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout title="UGen Pro Tools">
      {children}
    </DashboardLayout>
  )
}
