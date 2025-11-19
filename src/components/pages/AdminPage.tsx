import { useState, useEffect } from 'react'
import { Shield, Package, Images, Video, BookOpen, Heart, Key } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import AdminServices from '../admin/AdminServices'
import AdminPhotos from '../admin/AdminPhotos'
import AdminVideos from '../admin/AdminVideos'
import AdminBlogs from '../admin/AdminBlogs'
import AdminCharity from '../admin/AdminCharity'

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await window.spark.user()
        if (user) {
          setUserInfo(user)
          setIsAuthorized(user.isOwner)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        setIsAuthorized(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 text-muted-foreground animate-pulse" size={64} />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Key className="mx-auto mb-4 text-destructive" size={64} />
            <h2 className="font-heading font-bold text-2xl mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You do not have permission to access the admin panel. Only the website owner can manage content.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-primary" size={40} weight="fill" />
            <h1 className="font-heading font-bold text-4xl">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome, {userInfo?.login}! Manage your website content below.
          </p>
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
