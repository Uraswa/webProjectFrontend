export interface Product {
  id: string
  title: string
  price: number
  prevPrice?: number
  discount?: number
  imageUrl: string
  rating: number
  reviewsCount: number
}