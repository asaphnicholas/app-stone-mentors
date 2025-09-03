import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MentorLayout } from "@/components/layout/mentor-layout"

export default function MentorLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="mentor">
      <MentorLayout>{children}</MentorLayout>
    </ProtectedRoute>
  )
}
