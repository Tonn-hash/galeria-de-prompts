"use client"

import type React from "react"
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

/**
 * A themed wrapper around `sonner`’s `<Toaster />`.
 *
 * You can:
 *   import { Toaster } from "@/components/ui/toaster"
 * in any client component (e.g. `app/layout.tsx`).
 */
export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

/**
 * Convenience provider if you prefer:
 *   import { ToastProvider } from "@/components/ui/toaster"
 */
export function ToastProvider() {
  return <Toaster />
}
