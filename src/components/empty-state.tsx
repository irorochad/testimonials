"use client"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
    showIllustration?: boolean
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    showIllustration = true
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Empty state illustration */}
            {showIllustration && (
                <div className="w-32 h-32 mb-6 opacity-20">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-muted-foreground">
                        {/* Document stack illustration */}
                        <rect x="40" y="60" width="80" height="100" rx="8" fill="currentColor" opacity="0.3" />
                        <rect x="50" y="50" width="80" height="100" rx="8" fill="currentColor" opacity="0.5" />
                        <rect x="60" y="40" width="80" height="100" rx="8" fill="currentColor" opacity="0.7" />

                        {/* Quote marks */}
                        <text x="85" y="85" fontSize="24" fill="currentColor" opacity="0.6">&quot;</text>
                        <text x="115" y="115" fontSize="24" fill="currentColor" opacity="0.6">&quot;</text>

                        {/* Stars */}
                        <circle cx="170" cy="30" r="3" fill="currentColor" opacity="0.4" />
                        <circle cx="180" cy="45" r="2" fill="currentColor" opacity="0.4" />
                        <circle cx="160" cy="50" r="2" fill="currentColor" opacity="0.4" />
                        <circle cx="30" cy="170" r="3" fill="currentColor" opacity="0.4" />
                        <circle cx="20" cy="155" r="2" fill="currentColor" opacity="0.4" />
                        <circle cx="40" cy="150" r="2" fill="currentColor" opacity="0.4" />
                    </svg>
                </div>
            )}

            {/* Empty state content */}
            <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    {title}
                </h3>
                <p className="text-muted-foreground mb-6">
                    {description}
                </p>

                {/* Action button */}
                {actionLabel && (
                    <Button
                        onClick={() => {
                            if (onAction) {
                                onAction()
                            } else {
                                // Default action for import testimonials
                                console.log('Import testimonials clicked')
                            }
                        }}
                        className="btnSecondary"
                    >
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    )
}