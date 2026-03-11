import { Product, Review } from './types'

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    description: 'Elegant 1.5 carat diamond solitaire set in 18K white gold with a timeless design.',
    price: 4500,
    image_url: 'https://images.unsplash.com/photo-1515562141207-6811bcb33e20?w=500&h=500&fit=crop',
    category: 'Rings',
    rating: 4.8,
    reviews: 24,
    in_stock: true,
    sku: 'DSR-001'
  },
  {
    id: '2',
    name: 'Pearl Pendant Necklace',
    description: 'Sophisticated south sea pearl pendant on an 18K gold chain. Perfect for any occasion.',
    price: 2200,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'Necklaces',
    rating: 4.9,
    reviews: 18,
    in_stock: true,
    sku: 'PPN-001'
  },
  {
    id: '3',
    name: 'Emerald Drop Earrings',
    description: 'Stunning emerald drops with diamond accents. A statement piece for the modern woman.',
    price: 3800,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'Earrings',
    rating: 4.7,
    reviews: 12,
    in_stock: true,
    sku: 'EDE-001'
  },
  {
    id: '4',
    name: 'Sapphire Engagement Ring',
    description: 'Luxurious 2-carat sapphire surrounded by 0.5 carats of diamonds in 18K white gold.',
    price: 5600,
    image_url: 'https://images.unsplash.com/photo-1515562141207-6811bcb33e20?w=500&h=500&fit=crop',
    category: 'Rings',
    rating: 4.9,
    reviews: 31,
    in_stock: true,
    sku: 'SER-001'
  },
  {
    id: '5',
    name: 'Gold Tennis Bracelet',
    description: 'Classic 18K white gold tennis bracelet with brilliant cut diamonds throughout.',
    price: 3200,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'Bracelets',
    rating: 4.8,
    reviews: 22,
    in_stock: true,
    sku: 'GTB-001'
  },
  {
    id: '6',
    name: 'Aquamarine Statement Brooch',
    description: 'Vintage-inspired aquamarine brooch with antique gold detailing. A collector\'s piece.',
    price: 2800,
    image_url: 'https://images.unsplash.com/photo-1515562141207-6811bcb33e20?w=500&h=500&fit=crop',
    category: 'Brooches',
    rating: 4.6,
    reviews: 8,
    in_stock: false,
    sku: 'ASB-001'
  },
  {
    id: '7',
    name: 'Ruby Heart Pendant',
    description: 'Romantic ruby heart pendant with diamond surround in 18K rose gold.',
    price: 3400,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'Necklaces',
    rating: 4.9,
    reviews: 15,
    in_stock: true,
    sku: 'RHP-001'
  },
  {
    id: '8',
    name: 'Diamond Studs',
    description: '0.75 carat total weight diamond stud earrings in 18K white gold.',
    price: 1800,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    category: 'Earrings',
    rating: 4.8,
    reviews: 45,
    in_stock: true,
    sku: 'DS-001'
  }
]

export const REVIEWS: Review[] = [
  {
    id: '1',
    productId: '1',
    rating: 5,
    title: 'Absolutely stunning!',
    comment: 'The diamond ring exceeded my expectations. The craftsmanship is impeccable and the stone is incredibly brilliant.',
    author: 'Sarah M.',
    date: '2024-02-15'
  },
  {
    id: '2',
    productId: '1',
    rating: 4,
    title: 'Beautiful but pricey',
    comment: 'Gorgeous ring, excellent quality. Worth the investment.',
    author: 'Jennifer L.',
    date: '2024-01-20'
  },
  {
    id: '3',
    productId: '2',
    rating: 5,
    title: 'Perfect for special occasions',
    comment: 'The pearl pendant is elegant and the chain quality is excellent. Highly recommended.',
    author: 'Michelle K.',
    date: '2024-03-01'
  }
]

export const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Brooches']
