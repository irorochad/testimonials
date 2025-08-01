"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NotFoundProps {
  title?: string
  description?: string
  backLabel?: string
  backPath?: string
}

export function NotFound({
  title = "Page not found",
  description = "Sorry, we couldn't find the page you're looking for.",
  backLabel = "Go back",
  backPath
}: NotFoundProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backPath) {
      router.push(backPath)
    } else {
      router.back()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* 404 illustration */}
      <div className="w-32 h-32 mb-6 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full text-muted-foreground">
          {/* Broken document illustration */}
          <rect x="60" y="40" width="80" height="100" rx="8" fill="currentColor" opacity="0.3" />
          <rect x="50" y="50" width="80" height="100" rx="8" fill="currentColor" opacity="0.5" />

          {/* Crack/break lines */}
          <path d="M70 80 L120 120 M120 80 L70 120" stroke="currentColor" strokeWidth="3" opacity="0.6" />

          {/* Question marks */}
          <text x="40" y="35" fontSize="20" fill="currentColor" opacity="0.4">?</text>
          <text x="150" y="35" fontSize="20" fill="currentColor" opacity="0.4">?</text>
          <text x="30" y="170" fontSize="16" fill="currentColor" opacity="0.4">?</text>
          <text x="160" y="170" fontSize="16" fill="currentColor" opacity="0.4">?</text>
        </svg>
      </div>

      {/* 404 content */}
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>

        {/* Action button */}
        <Button
          onClick={handleBack}
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {backLabel}
        </Button>
      </div>
    </div>
  )
}