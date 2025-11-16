import { useState } from "react"
import { useRoute, useSearch } from "wouter"
import { SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductGridSkeleton } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useProducts } from "@/hooks/useProducts"
import { useCategories } from "@/hooks/useCategories"

export default function CatalogPage() {
  const [, params] = useRoute("/catalog")
  const searchParams = useSearch()
  const urlParams = new URLSearchParams(searchParams)
  
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "popularity" | "newest" | "rating">(
    (urlParams.get("sort") as any) || "newest"
  )
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const { data: productsData, isLoading: productsLoading } = useProducts({
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy: sortBy,
    page: 1,
    limit: 12,
  })

  const categories = categoriesData || []
  const products = productsData?.products || []
  const total = productsData?.total || 0
  const isLoading = productsLoading

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 font-semibold">Категории</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                data-testid={`checkbox-category-${category.id}`}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold">Цена</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            data-testid="slider-price-range"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]} ₽</span>
            <span>{priceRange[1]} ₽</span>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([])
          setPriceRange([0, 10000])
        }}
        data-testid="button-reset-filters"
      >
        Сбросить фильтры
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 font-serif text-3xl md:text-4xl font-semibold" data-testid="text-page-title">
            Каталог товаров
          </h1>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 rounded-lg border bg-card p-6">
                <h2 className="mb-4 font-semibold">Фильтры</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {/* Filters - Mobile */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden" data-testid="button-show-filters">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Фильтры
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Фильтры</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-muted-foreground">
                    Найдено: {total} {total === 1 ? 'товар' : total > 1 && total < 5 ? 'товара' : 'товаров'}
                  </span>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Новые</SelectItem>
                    <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
                    <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
                    <SelectItem value="popularity">Популярные</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="Товары не найдены"
                  description="Попробуйте изменить параметры фильтрации или поиска"
                  action={{
                    label: "Сбросить фильтры",
                    onClick: () => {
                      setSelectedCategories([])
                      setPriceRange([0, 10000])
                    },
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination - TODO */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
