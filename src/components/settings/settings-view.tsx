'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { BasicInfoSection } from './basic-info-section'
import { PublicSharingSection } from './public-sharing-section'
import { Project } from '@/db/types'
import { toast } from 'sonner'

interface SettingsViewProps {
  project: Project
}

export function SettingsView({ project }: SettingsViewProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('basic-info')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [projectData, setProjectData] = useState(project)

  // Handle URL-based tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['basic-info', 'public-sharing'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Handle tab changes with unsaved changes warning
  const handleTabChange = (newTab: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to switch tabs? Your changes will be lost.'
      )
      if (!confirmed) return
      setHasUnsavedChanges(false)
    }
    setActiveTab(newTab)
  }

  // Update project data and trigger re-render of child components
  const updateProjectData = (updates: Partial<Project>) => {
    setProjectData(prev => ({ ...prev, ...updates }))
  }

  // Handle unsaved changes state
  const handleUnsavedChanges = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges)
  }

  // Warn user about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  return (
    <div className="px-4 lg:px-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-fit">
          <TabsTrigger value="basic-info" className="text-sm px-3 sm:px-6">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="public-sharing" className="text-sm px-3 sm:px-6">
            Public Sharing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-6">
          <BasicInfoSection
            project={projectData}
            onUpdate={updateProjectData}
            onUnsavedChanges={handleUnsavedChanges}
          />
        </TabsContent>

        <TabsContent value="public-sharing" className="space-y-6">
          <PublicSharingSection
            project={projectData}
            onUpdate={updateProjectData}
            onUnsavedChanges={handleUnsavedChanges}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}