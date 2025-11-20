import { useState, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
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
  const [services, setServices] = useLocalStorage<Service[]>('admin-services', defaultServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState<Service>({
    id: '',
    name: '',
    category: 'pooja',
    duration: '',
    description: '',
    detailedDescription: '',
    benefits: [],
    includes: [],
    requirements: [],
    price: '',
    bestFor: []
  })

  // Helper states for array inputs
  const [benefitInput, setBenefitInput] = useState('')
  const [includesInput, setIncludesInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [bestForInput, setBestForInput] = useState('')

  const handleAdd = () => {
    setFormData({
      id: `service-${Date.now()}`,
      name: '',
      category: 'pooja',
      duration: '',
      description: '',
      detailedDescription: '',
      benefits: [],
      includes: [],
      requirements: [],
      price: '',
      bestFor: []
    })
    setBenefitInput('')
    setIncludesInput('')
    setRequirementInput('')
    setBestForInput('')
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
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description (shown on card)..."
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Detailed Information (Optional)</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="detailedDescription">Detailed Description</Label>
                  <Textarea
                    id="detailedDescription"
                    value={formData.detailedDescription || ''}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Full description (shown in modal)..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (€)</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                      <Input
                        id="price"
                        className="pl-7"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g., 150 or Contact for pricing"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Enter amount or text like "Contact for pricing"</p>
                </div>

                <div>
                  <Label>Benefits</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="Add a benefit..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && benefitInput.trim()) {
                          setFormData({ ...formData, benefits: [...(formData.benefits || []), benefitInput.trim()] })
                          setBenefitInput('')
                          e.preventDefault()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (benefitInput.trim()) {
                          setFormData({ ...formData, benefits: [...(formData.benefits || []), benefitInput.trim()] })
                          setBenefitInput('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.benefits || []).map((benefit, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {benefit}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-destructive"
                          onClick={() => setFormData({
                            ...formData,
                            benefits: (formData.benefits || []).filter((_, i) => i !== index)
                          })}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>What's Included</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={includesInput}
                      onChange={(e) => setIncludesInput(e.target.value)}
                      placeholder="Add an included item..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && includesInput.trim()) {
                          setFormData({ ...formData, includes: [...(formData.includes || []), includesInput.trim()] })
                          setIncludesInput('')
                          e.preventDefault()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (includesInput.trim()) {
                          setFormData({ ...formData, includes: [...(formData.includes || []), includesInput.trim()] })
                          setIncludesInput('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.includes || []).map((item, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {item}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-destructive"
                          onClick={() => setFormData({
                            ...formData,
                            includes: (formData.includes || []).filter((_, i) => i !== index)
                          })}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Requirements</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      placeholder="Add a requirement..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && requirementInput.trim()) {
                          setFormData({ ...formData, requirements: [...(formData.requirements || []), requirementInput.trim()] })
                          setRequirementInput('')
                          e.preventDefault()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (requirementInput.trim()) {
                          setFormData({ ...formData, requirements: [...(formData.requirements || []), requirementInput.trim()] })
                          setRequirementInput('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.requirements || []).map((req, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {req}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-destructive"
                          onClick={() => setFormData({
                            ...formData,
                            requirements: (formData.requirements || []).filter((_, i) => i !== index)
                          })}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Best For (Tags)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={bestForInput}
                      onChange={(e) => setBestForInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && bestForInput.trim()) {
                          setFormData({ ...formData, bestFor: [...(formData.bestFor || []), bestForInput.trim()] })
                          setBestForInput('')
                          e.preventDefault()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (bestForInput.trim()) {
                          setFormData({ ...formData, bestFor: [...(formData.bestFor || []), bestForInput.trim()] })
                          setBestForInput('')
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.bestFor || []).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-destructive"
                          onClick={() => setFormData({
                            ...formData,
                            bestFor: (formData.bestFor || []).filter((_, i) => i !== index)
                          })}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
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
