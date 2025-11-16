import { Link } from "wouter"
import { Card } from "@/components/ui/card"
import { Category } from "@shared/schema"

interface CategoryCardProps {
  category: Category
  imageUrl?: string
}

export function CategoryCard({ category, imageUrl }: CategoryCardProps) {
  return (
    <Link href={`/catalog?category=${category.slug}`}>
      <Card className="group relative overflow-hidden hover-elevate transition-all duration-200">
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3
              className="font-serif text-2xl font-semibold text-white"
              data-testid={`text-category-name-${category.id}`}
            >
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1 line-clamp-2 text-sm text-white/90">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
