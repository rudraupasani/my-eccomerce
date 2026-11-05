'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory, updateCategory, uploadCategoryImage } from '@/lib/api'
import { Category } from '@/lib/types'
import { Plus, Trash2, Layers, Search, ChevronRight, Edit, UploadCloud } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null)
  const [existingCategoryImage, setExistingCategoryImage] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      console.error('Details:', error?.message || JSON.stringify(error))
      alert(`Failed to load categories. See console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      setIsAdding(true)

      // upload image if provided
      let imageUrl: string | undefined
      if (newCategoryImage) {
        imageUrl = await uploadCategoryImage(newCategoryImage)
      }

      if (isEditing && editingCategoryId) {
        const updates: any = { name: newCategoryName.trim() }
        if (imageUrl) updates.image_url = imageUrl
        await updateCategory(editingCategoryId, updates)
      } else {
        const categoryData: any = { name: newCategoryName.trim() }
        if (imageUrl) categoryData.image_url = imageUrl
        await createCategory(categoryData)
      }

      // reset
      setNewCategoryName('')
      setNewCategoryImage(null)
      setExistingCategoryImage(null)
      setIsAdding(false)
      setIsEditing(false)
      setEditingCategoryId(null)
      fetchCategories()
    } catch (error: any) {
      console.error('Error adding/editing category:', error)
      console.error('Details:', error?.message || JSON.stringify(error))
      alert('Failed to save category. Note: Names must be unique.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" category? This may affect products linked to it.`)) return
    
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      console.error('Details:', error?.message || JSON.stringify(error))
      alert('Failed to delete category.')
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ScrollAnimate type="fade-down">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
             <span>Admin</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-accent">Categories</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Category Management</h1>
          <p className="text-muted-foreground">Define and organize your product catalog structure</p>
        </ScrollAnimate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Add Category ── */}
        <ScrollAnimate type="fade-right" className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              {isEditing ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmitCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fine Watches" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition placeholder:text-muted-foreground/50" 
                  disabled={isAdding}
                />
              </div>
              {/* image upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Category Image</label>
                <div
                  onClick={() => document.getElementById('category-file-input')?.click()}
                  className="border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition group relative overflow-hidden bg-background"
                >
                  {newCategoryImage ? (
                    <>
                      <img 
                        src={URL.createObjectURL(newCategoryImage)} 
                        alt="Preview" 
                        className="w-full h-full object-cover absolute inset-0" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                    </>
                  ) : existingCategoryImage ? (
                    <>
                      <img 
                        src={existingCategoryImage} 
                        alt="Existing" 
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = 'none'
                        }}
                        className="w-full h-full object-cover absolute inset-0" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-accent transition" />
                      <p className="text-xs font-bold text-foreground mb-1">Upload Image</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">JPEG, PNG up to 5MB</p>
                    </>
                  )}
                  <input
                    id="category-file-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setNewCategoryImage(file)
                      if (file) setExistingCategoryImage(null)
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-xl">
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   <strong>Note:</strong> A URL-friendly "slug" will be automatically generated from the category name. Deleting a category will untether any products assigned to it.
                 </p>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={isAdding || !newCategoryName.trim()}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {isEditing ? 'Update Category' : 'Create Category'}
                    </>
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn-ghost py-3 px-4"
                    onClick={() => {
                      setIsEditing(false)
                      setEditingCategoryId(null)
                      setNewCategoryName('')
                      setNewCategoryImage(null)
                      setExistingCategoryImage(null)
                    }}
                    disabled={isAdding}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </ScrollAnimate>

        {/* ── Category List ── */}
        <ScrollAnimate type="fade-left" className="lg:col-span-2">
          <div className="card overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/10">
               <h3 className="text-lg font-bold">Active Categories</h3>
               <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input
                   type="text"
                   placeholder="Search..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent transition"
                 />
               </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border">
                    <th className="text-left py-4 px-6">Image</th>
                    <th className="text-left py-4 px-6">Name</th>
                    <th className="text-left py-4 px-4">Slug</th>
                    <th className="text-left py-4 px-4">Created Date</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading Repository...</span>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-widest">No Categories Found</span>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-secondary/20 transition group">
                        <td className="py-4 px-6">
                          <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground uppercase font-black border border-border overflow-hidden">
                            {category.image_url ? (
                              <img 
                                src={category.image_url} 
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              '—'
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-foreground">
                          {category.name}
                        </td>
                        <td className="py-4 px-4 text-xs font-mono text-muted-foreground">
                          /{category.slug}
                        </td>
                        <td className="py-4 px-4 text-xs text-muted-foreground">
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                           <div className="flex justify-end gap-2">
                             <button
                               onClick={() => {
                                 setIsEditing(true)
                                 setEditingCategoryId(category.id)
                                 setNewCategoryName(category.name)
                                 setExistingCategoryImage(category.image_url || null)
                               }}
                               className="p-2 hover:bg-secondary hover:text-accent rounded-lg transition"
                               title="Edit Category"
                             >
                                <Edit className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleDeleteCategory(category.id, category.name)}
                               className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition"
                               title="Delete Category"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-border bg-secondary/5 text-xs text-muted-foreground text-center font-medium">
               {categories.length} total categories mapped to inventory
            </div>
          </div>
        </ScrollAnimate>

      </div>
    </div>
  )
}
