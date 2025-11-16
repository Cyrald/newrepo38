import { Link } from "wouter"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@shared/schema"

interface ProductCardProps {
  product: Product & { images?: { url: string }[] }
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const hasDiscount = parseFloat(product.discountPercentage) > 0
  const discountedPrice = hasDiscount
    ? parseFloat(product.price) * (1 - parseFloat(product.discountPercentage) / 100)
    : parseFloat(product.price)
  
  const firstImage = product.images?.[0]?.url

  return (
    <Card className="group relative overflow-hidden hover-elevate transition-all duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Eye className="h-12 w-12" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="default" data-testid={`badge-new-${product.id}`}>
                Новый
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" data-testid={`badge-discount-${product.id}`}>
                -{product.discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Quick actions on hover */}
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onAddToWishlist && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  onAddToWishlist(product.id)
                }}
                data-testid={`button-wishlist-${product.id}`}
                className="h-8 w-8"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 line-clamp-2 text-base font-semibold" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        {product.weight && (
          <p className="mb-2 text-xs text-muted-foreground" data-testid={`text-weight-${product.id}`}>
            {product.weight} г
          </p>
        )}
        {product.volume && (
          <p className="mb-2 text-xs text-muted-foreground" data-testid={`text-volume-${product.id}`}>
            {product.volume} мл
          </p>
        )}

        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground" data-testid={`text-price-${product.id}`}>
            {discountedPrice.toFixed(0)} ₽
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through" data-testid={`text-old-price-${product.id}`}>
              {parseFloat(product.price).toFixed(0)} ₽
            </span>
          )}
        </div>

        {product.stockQuantity > 0 ? (
          <Button
            className="w-full"
            size="sm"
            onClick={() => onAddToCart?.(product.id)}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            В корзину
          </Button>
        ) : (
          <Button
            className="w-full"
            size="sm"
            variant="secondary"
            disabled
            data-testid={`button-out-of-stock-${product.id}`}
          >
            Нет в наличии
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
