'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Loader2 } from 'lucide-react'
import { Requirement } from '@/types'

interface VendorFormProps {
  onSubmit: (need: string, requirements: Requirement[]) => Promise<void>
  isLoading: boolean
}

export function VendorForm({ onSubmit, isLoading }: VendorFormProps) {
  const [need, setNeed] = useState('')
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', description: '', priority: 'must-have', weight: 8 }
  ])

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { 
        id: Date.now().toString(), 
        description: '', 
        priority: 'must-have', 
        weight: 5 
      }
    ])
  }

  const removeRequirement = (id: string) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter(req => req.id !== id))
    }
  }

  const updateRequirement = (id: string, field: keyof Requirement, value: any) => {
    setRequirements(requirements.map(req => 
      req.id === id ? { ...req, [field]: value } : req
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!need.trim()) {
      alert('Please enter your vendor need')
      return
    }
    
    const validRequirements = requirements.filter(req => req.description.trim())
    if (validRequirements.length === 0) {
      alert('Please add at least one requirement')
      return
    }
    
    await onSubmit(need, validRequirements)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Perfect Vendor
        </CardTitle>
        <CardDescription>
          Tell us what you need, and we'll find and compare the best vendors for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Need Input */}
          <div className="space-y-2">
            <Label htmlFor="need" className="text-base font-semibold">
              What do you need? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="need"
              placeholder="e.g., Email delivery service for India, Vector database for small team"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              disabled={isLoading}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              Be specific about your use case to get better results
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Requirements <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                disabled={isLoading || requirements.length >= 10}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </Button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={req.id} className="flex gap-2 items-start p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Requirement ${index + 1} (e.g., Budget under $100/month, GDPR compliant)`}
                      value={req.description}
                      onChange={(e) => updateRequirement(req.id, 'description', e.target.value)}
                      disabled={isLoading}
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={req.priority}
                        onChange={(e) => updateRequirement(req.id, 'priority', e.target.value)}
                        disabled={isLoading}
                        className="text-sm border rounded px-2 py-1 bg-background"
                      >
                        <option value="must-have">Must Have</option>
                        <option value="nice-to-have">Nice to Have</option>
                        <option value="optional">Optional</option>
                      </select>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">Weight:</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={req.weight}
                          onChange={(e) => updateRequirement(req.id, 'weight', parseInt(e.target.value))}
                          disabled={isLoading}
                          className="w-16 text-sm border rounded px-2 py-1 bg-background"
                        />
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                      
                      <Badge variant={
                        req.priority === 'must-have' ? 'destructive' :
                        req.priority === 'nice-to-have' ? 'secondary' : 'outline'
                      }>
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(req.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Add 5-8 requirements. Use weights (1-10) to prioritize what matters most.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building Your Shortlist...
              </>
            ) : (
              <>
                🔍 Build Shortlist
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
