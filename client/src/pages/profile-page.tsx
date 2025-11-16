import { useState } from "react"
import { User, Package, Star, MapPin, LogOut } from "lucide-react"
import { useLocation } from "wouter"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  // TODO: Fetch user data from API
  const user = {
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivan@example.com",
    phone: "+7 (900) 123-45-67",
    bonusPoints: 500,
  }

  const orders = [] // TODO: Fetch from API
  const addresses = [] // TODO: Fetch from API

  const handleLogout = () => {
    // TODO: Implement logout
    toast({
      title: "Вы вышли из системы",
    })
    setLocation("/")
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update
    toast({
      title: "Профиль обновлен",
      description: "Изменения сохранены",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold" data-testid="text-page-title">
                Профиль
              </h1>
              <p className="mt-1 text-muted-foreground">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" data-testid="tab-profile">
                <User className="mr-2 h-4 w-4" />
                Личные данные
              </TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">
                <Package className="mr-2 h-4 w-4" />
                Заказы
              </TabsTrigger>
              <TabsTrigger value="bonuses" data-testid="tab-bonuses">
                <Star className="mr-2 h-4 w-4" />
                Бонусы
              </TabsTrigger>
              <TabsTrigger value="addresses" data-testid="tab-addresses">
                <MapPin className="mr-2 h-4 w-4" />
                Адреса
              </TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Личные данные</CardTitle>
                  <CardDescription>
                    Обновите свою личную информацию
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input
                          id="firstName"
                          defaultValue={user.firstName}
                          data-testid="input-first-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input
                          id="lastName"
                          defaultValue={user.lastName}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={user.phone}
                        data-testid="input-phone"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        data-testid="input-current-password"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          data-testid="input-new-password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          data-testid="input-confirm-password"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" data-testid="button-save-profile">
                        Сохранить изменения
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>История заказов</CardTitle>
                  <CardDescription>
                    Просмотр всех ваших заказов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">У вас пока нет заказов</p>
                      <p className="text-muted-foreground mb-6">
                        Начните с выбора товаров в каталоге
                      </p>
                      <Button onClick={() => setLocation("/catalog")} data-testid="button-go-to-catalog">
                        Перейти в каталог
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <Card key={order.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="font-semibold">Заказ №{order.orderNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                </p>
                              </div>
                              <Badge variant={
                                order.status === "delivered" ? "default" :
                                order.status === "cancelled" ? "destructive" :
                                "secondary"
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-semibold">
                                {parseFloat(order.totalAmount)} ₽
                              </p>
                              <Button variant="outline" size="sm">
                                Подробнее
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bonuses */}
            <TabsContent value="bonuses">
              <Card>
                <CardHeader>
                  <CardTitle>Бонусная программа</CardTitle>
                  <CardDescription>
                    Накапливайте бонусы и получайте скидки
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-primary/10 p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Доступные бонусы
                      </p>
                      <p className="text-4xl font-bold text-primary" data-testid="text-bonus-points">
                        {user.bonusPoints}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        1 бонус = 1 рубль
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Как получить бонусы?</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 100 бонусов при регистрации</li>
                        <li>• 5% от суммы каждого заказа</li>
                        <li>• За написание отзыва - 50 бонусов</li>
                        <li>• За приглашение друга - 200 бонусов</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="font-semibold">Как использовать?</h3>
                      <p className="text-sm text-muted-foreground">
                        При оформлении заказа вы можете использовать до 30% от суммы заказа бонусами
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Адреса доставки</CardTitle>
                  <CardDescription>
                    Управление адресами для быстрого оформления заказов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="py-12 text-center">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">Нет сохраненных адресов</p>
                      <p className="text-muted-foreground mb-6">
                        Добавьте адрес для быстрого оформления заказов
                      </p>
                      <Button data-testid="button-add-address">
                        Добавить адрес
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button className="w-full" data-testid="button-add-address">
                        Добавить новый адрес
                      </Button>
                      {addresses.map((address: any) => (
                        <Card key={address.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                {address.isDefault && (
                                  <Badge className="mb-2" variant="default">Основной</Badge>
                                )}
                                <p className="font-semibold">{address.city}</p>
                                <p className="text-sm text-muted-foreground">
                                  {address.street}, д. {address.building}
                                  {address.apartment && `, кв. ${address.apartment}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.postalCode}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Изменить
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Удалить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
