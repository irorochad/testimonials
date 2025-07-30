"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconMail, IconLogout } from "@tabler/icons-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">ProofFlow</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <IconMail /><span>Quick Create</span>
            <span className="sr-only">Quick Create</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <IconLogout className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
