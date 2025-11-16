import { Link } from "wouter"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
  }

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">О магазине</h3>
            <p className="text-sm text-muted-foreground">
              ЭкоМаркет — ваш надёжный поставщик натуральных и органических продуктов высочайшего качества.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Покупателям</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog">
                  <Button variant="link" className="h-auto p-0 text-muted-foreground">
                    Каталог
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <Button variant="link" className="h-auto p-0 text-muted-foreground">
                    О нас
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/delivery">
                  <Button variant="link" className="h-auto p-0 text-muted-foreground">
                    Доставка и оплата
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/contacts">
                  <Button variant="link" className="h-auto p-0 text-muted-foreground">
                    Контакты
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+79001234567" className="hover:text-foreground">
                  +7 (900) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@ecomarket.ru" className="hover:text-foreground">
                  info@ecomarket.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <a href="#" className="hover:text-foreground">
                  @ecomarket
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <a href="#" className="hover:text-foreground">
                  /ecomarket
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Рассылка</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Подпишитесь на новости и специальные предложения
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                required
                data-testid="input-newsletter"
              />
              <Button type="submit" className="w-full" size="sm" data-testid="button-subscribe">
                Подписаться
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ЭкоМаркет. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
