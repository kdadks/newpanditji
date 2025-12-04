import { useState } from 'react'
import { Images, Video } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import AdminPhotos from './AdminPhotos'
import AdminVideos from './AdminVideos'

export default function AdminMedia() {
  const [activeTab, setActiveTab] = useState('photos')

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Media Management</CardTitle>
          <CardDescription className="mt-2">
            Manage your photo gallery and video content
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs for Photos and Videos */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <Images size={18} />
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <Video size={18} />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          <AdminPhotos />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <AdminVideos />
        </TabsContent>
      </Tabs>
    </div>
  )
}
