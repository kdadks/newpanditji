'use client'

import { useState } from 'react'
import {
  Package,
  Images,
  Video,
  BookOpen,
  Heart,
  SignOut,
  User,
  FileText,
  List,
  DotsThreeOutline,
  X,
  ChartLine,
  Books
} from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  currentSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
  userEmail?: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
}

const menuItems: MenuItem[] = [
  { id: 'analytics', label: 'Analytics', icon: <ChartLine size={20} /> },
  { id: 'services', label: 'Services', icon: <Package size={20} /> },
  { id: 'media', label: 'Media', icon: <Images size={20} /> },
  { id: 'books', label: 'Books', icon: <Books size={20} /> },
  { id: 'blogs', label: 'Blogs', icon: <BookOpen size={20} /> },
  { id: 'testimonials', label: 'Testimonials', icon: <List size={20} /> },
  { id: 'charity', label: 'Charity', icon: <Heart size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  { id: 'content', label: 'CMS', icon: <FileText size={20} /> },
]

export default function AdminLayout({
  children,
  currentSection,
  onSectionChange,
  onLogout,
  userEmail
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-heading font-bold text-xl">Admin Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <DotsThreeOutline size={24} />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-card border-r",
          "lg:translate-x-0 w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <h1 className="font-heading font-bold text-2xl text-primary">Admin Panel</h1>
            {userEmail && (
              <p className="text-xs text-muted-foreground mt-2 truncate">{userEmail}</p>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                    "hover:bg-accent/50 group",
                    currentSection === item.id
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-foreground"
                  )}
                >
                  <span className={cn(
                    "transition-transform group-hover:scale-110",
                    currentSection === item.id ? "scale-110" : ""
                  )}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onLogout}
            >
              <SignOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
