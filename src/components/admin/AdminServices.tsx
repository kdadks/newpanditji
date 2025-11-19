import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PencilSimple, Trash, FloppyDisk, X } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { toast } from 'sonner'
import { Service, services as defaultServices } from '../../lib/data'

export default function AdminServices() {
  const [services, setServices] = useKV<Service[]>('admin-services', defaultServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState<Service>({
    id: '',
    name: '',
    category: 'pooja',
    duration: '',
    description: ''
  })

  const handleAdd = () => {
    setFormData({
      id: `service-${Date.now()}`,
      name: '',
      category: 'pooja',
      duration: '',
      description: ''
    })
    setEditingService(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (service: Service) => {
    setFormData({ ...service })
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.duration || !formData.description) {
      toast.error('Please fill in all fields')
      return
    }

    setServices((currentServices) => {
      const serviceList = currentServices || []
      if (editingService) {
        return serviceList.map(s => s.id === editingService.id ? formData : s)
      } else {
        return [...serviceList, formData]
      }
    })

    toast.success(editingService ? 'Service updated successfully' : 'Service added successfully')
    setIsDialogOpen(false)
    setEditingService(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices((currentServices) => (currentServices || []).filter(s => s.id !== id))
      toast.success('Service deleted successfully')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Services</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus size={18} />
            Add Service
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(services || []).map((service) => (
              <Card key={service.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg">{service.name}</h3>
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <p className="text-xs text-muted-foreground font-medium">Duration: {service.duration}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                        <PencilSimple size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Satyanarayana Pooja"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Service['category']) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pooja">Poojas</SelectItem>
                  <SelectItem value="sanskar">Sanskars</SelectItem>
                  <SelectItem value="paath">Paath/Recitations</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="wellness">Meditation & Yoga</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2.5 hours"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <FloppyDisk size={18} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
