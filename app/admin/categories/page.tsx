'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '@/lib/api'
import { Category } from '@/lib/types'
import { Plus, Trash2, Layers, Search, ChevronRight } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
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
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      setIsAdding(true)
      await createCategory(newCategoryName.trim())
      setNewCategoryName('')
      fetchCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Failed to add category. Note: Names must be unique.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" category? This may affect products linked to it.`)) return
    
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
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
              New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-6">
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
              
              <div className="bg-secondary/50 p-4 rounded-xl">
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   <strong>Note:</strong> A URL-friendly "slug" will be automatically generated from the category name. Deleting a category will untether any products assigned to it.
                 </p>
              </div>

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
                    Create Category
                  </>
                )}
              </button>
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
                    <th className="text-left py-4 px-6">Name</th>
                    <th className="text-left py-4 px-4">Slug</th>
                    <th className="text-left py-4 px-4">Created Date</th>
                    <th className="text-right py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading Repository...</span>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        <span className="text-xs font-bold uppercase tracking-widest">No Categories Found</span>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-secondary/20 transition group">
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
                           <button 
                             onClick={() => handleDeleteCategory(category.id, category.name)}
                             className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition"
                             title="Delete Category"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
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
