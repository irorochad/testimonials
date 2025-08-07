"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

/**
 * ReusableModal Component
 * 
 * A flexible, reusable modal component that can be used throughout the application.
 * Built on top of shadcn/ui Dialog component with additional customization options.
 * 
 * Features:
 * - Customizable size (sm, md, lg, xl, full)
 * - Optional header with title and description
 * - Flexible content area
 * - Automatic close handling
 * - Responsive design
 */

interface ReusableModalProps {
    /** Controls whether the modal is open or closed */
    isOpen: boolean
    /** Callback function called when the modal should be closed */
    onClose: () => void
    /** Modal title displayed in the header */
    title?: string
    /** Modal description displayed below the title */
    description?: string
    /** Modal size variant */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    /** Modal content */
    children: React.ReactNode
    /** Additional CSS classes for the modal content */
    className?: string
    /** Whether to show the close button (X) in the header */
    showCloseButton?: boolean
}

/**
 * Size configuration for different modal variants
 * Each size defines the maximum width and responsive behavior
 */
const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
}

export function ReusableModal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    children,
    className = '',
    showCloseButton = true
}: ReusableModalProps) {
    /**
     * Handle modal close events
     * Calls the onClose callback when the modal should be closed
     */
    const handleClose = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className={`${sizeClasses[size]} ${className}`}
                // Hide the default close button if showCloseButton is false
                style={showCloseButton ? {} : {
                    '& > button[aria-label="Close"]': { display: 'none' }
                } as React.CSSProperties}
            >
                {/* Modal Header - Only show if title or description is provided */}
                {(title || description) && (
                    <DialogHeader>
                        {title && (
                            <DialogTitle className="text-xl font-semibold">
                                {title}
                            </DialogTitle>
                        )}
                        {description && (
                            <DialogDescription className="text-muted-foreground">
                                {description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}

                {/* Modal Content */}
                <div className="mt-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}