"use client";

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"
import { IconSquareRoundedPlus } from "@tabler/icons-react"
import { GlobalCreateModal } from "@/components/modals/global-create-modal"

/**
 * SiteHeader Component
 * 
 * The main header component that appears at the top of the application.
 * Contains navigation controls, theme toggle, and the global create button.
 * 
 * Features:
 * - Responsive sidebar trigger
 * - Global create button with modal
 * - Theme toggle
 * - User menu
 */

export function SiteHeader() {
  // State to control the global create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  /**
   * Handle global create button click
   * Opens the global create modal with different creation options
   */
  const handleCreateClick = () => {
    setIsCreateModalOpen(true)
  }

  /**
   * Handle create modal close
   * Closes the global create modal
   */
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false)
  }

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          
          {/* Header Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Global Create Button */}
            <Button
              className="btnSecondary min-w-8 duration-200 ease-linear cursor-pointer"
              onClick={handleCreateClick}
              aria-label="Open create menu"
            >
              <IconSquareRoundedPlus />
              <span>Create</span>
            </Button>
            
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Global Create Modal */}
      <GlobalCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
      />
    </>
  )
}
