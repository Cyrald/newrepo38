import { Heart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductGridSkeleton } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"

export default function WishlistPage() {
  // TODO: Fetch wishlist from API
  const isLoading = false
  const wishlistItems = []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 font-serif text-3xl md:text-4xl font-semibold" data-testid="text-page-title">
            Избранное
          </h1>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : wishlistItems.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Избранное пусто"
              description="Добавьте товары в избранное, чтобы не потерять их"
              action={{
                label: "Перейти в каталог",
                onClick: () => window.location.href = "/catalog",
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item: any) => (
                <ProductCard
                  key={item.id}
                  product={item.product}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
