import { useState } from 'react'
import { Shield, Package, Images, Video, BookOpen, Heart, Key, SignOut, Spinner } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import AdminServices from '../admin/AdminServices'
import AdminPhotos from '../admin/AdminPhotos'
import AdminVideos from '../admin/AdminVideos'
import AdminBlogs from '../admin/AdminBlogs'
import AdminCharity from '../admin/AdminCharity'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

export default function AdminPage() {
  const { user, loading, isAuthenticated, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Login successful!')
      } else {
        toast.error('Invalid credentials. Please try again.')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setEmail('')
    setPassword('')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-muted-foreground animate-pulse" size={64} />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-4 w-full">
          <CardHeader className="text-center pb-4">
            <Shield className="mx-auto mb-4 text-primary" size={64} weight="fill" />
            <CardTitle className="font-heading font-bold text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Spinner className="mr-2 animate-spin" size={18} />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Key className="mr-2" size={18} />
                    Login
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                Admin access only. Contact the site owner for credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-primary" size={40} weight="fill" />
                <h1 className="font-heading font-bold text-4xl">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Welcome, {user?.email}! Manage your website content below.
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <SignOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-muted/50 p-2 mb-8">
            <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="mr-2" size={18} />
              Services
            </TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Images className="mr-2" size={18} />
              Photos
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Video className="mr-2" size={18} />
              Videos
            </TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="mr-2" size={18} />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="charity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="mr-2" size={18} />
              Charity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <AdminServices />
          </TabsContent>

          <TabsContent value="photos">
            <AdminPhotos />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideos />
          </TabsContent>

          <TabsContent value="blogs">
            <AdminBlogs />
          </TabsContent>

          <TabsContent value="charity">
            <AdminCharity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
