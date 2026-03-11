'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Edit, Trash2, Plus, Search, Filter, ChevronRight, MoreHorizontal, Download, UploadCloud } from 'lucide-react'
import { ScrollAnimate } from '@/components/scroll-animate'
import { Slider } from '@/components/ui/slider'
import { getProducts, getCategories, createProduct, deleteProduct, uploadProductImage } from '@/lib/api'
import { Product, Category } from '@/lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  // New Product Form State
  const [newName, setNewName] = useState('')
  const [newSku, setNewSku] = useState('')
  const [newPrice, setNewPrice] = useState('0')
  const [newDescription, setNewDescription] = useState('')
  const [newCategoryId, setNewCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      setProducts(fetchedProducts)
      setCategories(fetchedCategories)
      if (fetchedCategories.length > 0) {
        setNewCategoryId(fetchedCategories[0].id)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newPrice || !newCategoryId || !imageFile) {
      alert('Please fill out all required fields and upload an image.')
      return
    }

    try {
      setIsSubmitting(true)
      
      // 1. Upload Image
      const imageUrl = await uploadProductImage(imageFile)

      // 2. Create Product
      await createProduct({
        name: newName,
        sku: newSku || `LX-${Math.floor(1000 + Math.random() * 9000)}`,
        price: parseFloat(newPrice),
        description: newDescription,
        category_id: newCategoryId,
        image_url: imageUrl,
        in_stock: true,
        rating: 5.0,
        reviews: 0
      })

      // 3. Reset and Refresh
      setIsAddingProduct(false)
      setNewName('')
      setNewSku('')
      setNewPrice('0')
      setNewDescription('')
      setImageFile(null)
      fetchData()

    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return
    try {
      await deleteProduct(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product.')
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || p.categories?.name === filterCategory
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="space-y-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <ScrollAnimate type="fade-down">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
             <span>Admin</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-accent">Inventory</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">Manage, edit, and monitor your jewelry stock levels</p>
        </ScrollAnimate>
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-2 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Stock Report
          </button>
          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="btn-primary py-2 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Piece
          </button>
        </div>
      </div>

      {/* ── Add Product Form (Collapsible) ── */}
      {isAddingProduct && (
        <ScrollAnimate type="scale-up">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">New Collection Item</h2>
            <form onSubmit={handleCreateProduct}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Image Upload Area */}
                <div className="md:col-span-1 space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Product Image *</label>
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition group relative overflow-hidden bg-background"
                   >
                     {imageFile ? (
                       <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover rounded-lg absolute inset-0" />
                     ) : (
                       <>
                         <UploadCloud className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-accent transition" />
                         <p className="text-xs font-bold text-foreground mb-1">Upload High-Res Image</p>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest">JPEG, PNG up to 5MB</p>
                       </>
                     )}
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*"
                       onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                     />
                   </div>
                </div>

                {/* Details Area */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Product Name *</label>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Diamond Solitaire" className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">SKU Code</label>
                    <input type="text" value={newSku} onChange={e => setNewSku(e.target.value)} placeholder="Leave blank to auto-generate" className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Base Price ($) *</label>
                    <input type="number" min="0" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} required placeholder="2999" className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Category *</label>
                    <div className="relative">
                      <select 
                        required
                        value={newCategoryId}
                        onChange={e => setNewCategoryId(e.target.value)}
                        className="w-full appearance-none px-4 py-3 bg-background border border-border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Description</label>
                    <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3} placeholder="Brief product description for the catalog..." className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent transition resize-none" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 pt-6 border-t border-border">
                <button type="submit" disabled={isSubmitting} className="btn-primary px-8 flex items-center justify-center min-w-[160px]">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save to Catalog'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="btn-ghost px-6"
                  disabled={isSubmitting}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </ScrollAnimate>
      )}

      {/* ── Filter & Search Bar ── */}
      <ScrollAnimate type="fade-up">
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Product Name, SKU, or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent transition"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
             <Filter className="w-4 h-4 text-muted-foreground hidden md:block mx-1" />
             <div className="relative flex-1 md:w-48">
               <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
             </div>
             
            <div className="w-full md:w-64 mt-2 md:mt-0 px-2">
              <Slider
                value={priceRange}
                onValueChange={(val) => setPriceRange(val as [number, number])}
                min={0}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimate>

      {/* ── Products Table ── */}
      <ScrollAnimate type="fade-up" delay={100}>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-[10px] uppercase font-bold tracking-widest border-b border-border">
                  <th className="text-left py-4 px-8">Product Piece</th>
                  <th className="text-left py-4 px-4">SKU Code</th>
                  <th className="text-left py-4 px-4">Category</th>
                  <th className="text-left py-4 px-4">Market Price</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-right py-4 px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Loading Catalog...</span>
                      </td>
                    </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-widest">No Products Found</span>
                    </td>
                  </tr>
                ) : filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition group">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg border border-border bg-background overflow-hidden shrink-0">
                          {product.image_url ? (
                             <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-[10px] text-muted-foreground uppercase font-black">No Img</div>
                          )}
                        </div>
                        <span className="font-bold text-foreground leading-tight">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-accent tracking-tighter uppercase">{product.sku}</td>
                    <td className="py-4 px-4">
                       <span className="px-2 py-0.5 bg-secondary border border-border rounded text-[10px] font-bold uppercase tracking-widest">{product.categories?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="py-4 px-4 font-black text-foreground">${product.price.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`badge py-1 px-3 ${
                        product.in_stock ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {product.in_stock ? 'Available' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <button className="p-2 hover:bg-secondary hover:text-accent rounded-lg transition" title="Edit">
                             <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition" 
                            title="Delete"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-border flex items-center justify-between bg-secondary/10">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Displaying {filteredProducts.length} unique items in catalog</p>
          </div>
        </div>
      </ScrollAnimate>
    </div>
   )
}
