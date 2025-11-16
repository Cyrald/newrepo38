import { useState } from "react"
import { useLocation } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronLeft, ChevronRight, Package, Truck, CreditCard, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const deliverySchema = z.object({
  city: z.string().min(1, "Укажите город"),
  street: z.string().min(1, "Укажите улицу"),
  building: z.string().min(1, "Укажите дом"),
  apartment: z.string().optional(),
  postalCode: z.string().min(6, "Укажите индекс"),
  firstName: z.string().min(1, "Укажите имя"),
  lastName: z.string().optional(),
  patronymic: z.string().optional(),
  phone: z.string().min(11, "Укажите телефон"),
  email: z.string().email("Неверный email"),
  comment: z.string().optional(),
})

type DeliveryFormData = z.infer<typeof deliverySchema>

const STEPS = [
  { id: 1, title: "Адрес", icon: Package },
  { id: 2, title: "Доставка", icon: Truck },
  { id: 3, title: "Оплата", icon: CreditCard },
  { id: 4, title: "Подтверждение", icon: CheckCircle },
]

export default function CheckoutPage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState("cdek")
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [useBonuses, setUseBonuses] = useState(false)
  const [promocode, setPromocode] = useState("")

  // TODO: Fetch cart items, user data, bonuses
  const cartItems = []
  const subtotal = 0
  const deliveryCost = 300
  const discount = 0
  const bonusPoints = 500
  const total = subtotal + deliveryCost - discount

  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      city: "",
      street: "",
      building: "",
      apartment: "",
      postalCode: "",
      firstName: "",
      lastName: "",
      patronymic: "",
      phone: "",
      email: "",
      comment: "",
    },
  })

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmitDelivery = (data: DeliveryFormData) => {
    console.log("Delivery data:", data)
    handleNext()
  }

  const handleSubmitOrder = async () => {
    try {
      // TODO: Implement order creation API call
      console.log("Creating order...")
      
      toast({
        title: "Заказ оформлен!",
        description: "Мы отправили подтверждение на вашу почту",
      })
      
      setLocation("/profile/orders")
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать заказ",
        variant: "destructive",
      })
    }
  }

  const handleApplyPromocode = () => {
    // TODO: Implement promocode validation
    if (promocode) {
      toast({
        title: "Промокод применен",
        description: `Скидка 10% на заказ`,
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 font-serif text-3xl md:text-4xl font-semibold" data-testid="text-page-title">
            Оформление заказа
          </h1>

          {/* Steps Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div
                      className={`flex flex-col items-center ${
                        index < STEPS.length - 1 ? "flex-1" : ""
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCompleted
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    {index < STEPS.length - 1 && (
                      <div
                        className={`mx-4 h-0.5 flex-1 ${
                          isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Step 1: Delivery Address */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="mb-6 font-serif text-2xl font-semibold">
                        Адрес доставки
                      </h2>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitDelivery)} className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Имя *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-first-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Фамилия</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-last-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Телефон *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="+7 (900) 123-45-67"
                                      {...field}
                                      data-testid="input-phone"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      {...field}
                                      data-testid="input-email"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Город *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-city" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Индекс *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-postal-code" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Улица *</FormLabel>
                                <FormControl>
                                  <Input {...field} data-testid="input-street" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="building"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Дом *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-building" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="apartment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Квартира</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-apartment" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Комментарий к заказу</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Дополнительная информация для курьера"
                                    {...field}
                                    data-testid="input-comment"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button type="submit" data-testid="button-next-step">
                              Продолжить
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* Step 2: Delivery Method */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="mb-6 font-serif text-2xl font-semibold">
                        Способ доставки
                      </h2>
                      <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                        <div className="space-y-4">
                          <Card className={deliveryMethod === "cdek" ? "border-primary" : ""}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="cdek" id="cdek" data-testid="radio-cdek" />
                                <div className="flex-1">
                                  <label htmlFor="cdek" className="font-semibold cursor-pointer">
                                    СДЭК
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    Доставка курьером или в пункт выдачи
                                  </p>
                                  <p className="mt-2 font-semibold">300 ₽ • 2-5 дней</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={deliveryMethod === "boxberry" ? "border-primary" : ""}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="boxberry" id="boxberry" data-testid="radio-boxberry" />
                                <div className="flex-1">
                                  <label htmlFor="boxberry" className="font-semibold cursor-pointer">
                                    Boxberry
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    Доставка в пункт выдачи
                                  </p>
                                  <p className="mt-2 font-semibold">250 ₽ • 2-4 дня</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </RadioGroup>

                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={handleBack} data-testid="button-back">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Назад
                        </Button>
                        <Button onClick={handleNext} data-testid="button-next-step">
                          Продолжить
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Method */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="mb-6 font-serif text-2xl font-semibold">
                        Способ оплаты
                      </h2>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-4">
                          <Card className={paymentMethod === "online" ? "border-primary" : ""}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="online" id="online" data-testid="radio-online-payment" />
                                <div className="flex-1">
                                  <label htmlFor="online" className="font-semibold cursor-pointer">
                                    Онлайн-оплата (ЮKassa)
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    Банковской картой или через СБП
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={paymentMethod === "cash" ? "border-primary" : ""}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value="cash" id="cash" data-testid="radio-cash-payment" />
                                <div className="flex-1">
                                  <label htmlFor="cash" className="font-semibold cursor-pointer">
                                    При получении
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    Наличными или картой курьеру
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </RadioGroup>

                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={handleBack} data-testid="button-back">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Назад
                        </Button>
                        <Button onClick={handleNext} data-testid="button-next-step">
                          Продолжить
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <div>
                      <h2 className="mb-6 font-serif text-2xl font-semibold">
                        Подтверждение заказа
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-2 font-semibold">Адрес доставки</h3>
                          <p className="text-sm text-muted-foreground">
                            {/* TODO: Display address from form */}
                            Москва, ул. Пушкина, д. 10, кв. 5
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="mb-2 font-semibold">Доставка</h3>
                          <p className="text-sm text-muted-foreground">
                            {deliveryMethod === "cdek" ? "СДЭК" : "Boxberry"} • {deliveryCost} ₽
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="mb-2 font-semibold">Оплата</h3>
                          <p className="text-sm text-muted-foreground">
                            {paymentMethod === "online" ? "Онлайн-оплата (ЮKassa)" : "При получении"}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="mb-2 font-semibold">Товары</h3>
                          <div className="space-y-2">
                            {cartItems.map((item: any) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>{parseFloat(item.product.price) * item.quantity} ₽</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={handleBack} data-testid="button-back">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Назад
                        </Button>
                        <Button onClick={handleSubmitOrder} data-testid="button-submit-order">
                          Оформить заказ
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                  <CardDescription>{cartItems.length} товаров</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Товары</span>
                      <span data-testid="text-subtotal">{subtotal.toFixed(2)} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Доставка</span>
                      <span data-testid="text-delivery">{deliveryCost.toFixed(2)} ₽</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary">
                        <span>Скидка</span>
                        <span>-{discount.toFixed(2)} ₽</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Promocode */}
                  <div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Промокод"
                        value={promocode}
                        onChange={(e) => setPromocode(e.target.value)}
                        data-testid="input-promocode"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromocode}
                        data-testid="button-apply-promocode"
                      >
                        Применить
                      </Button>
                    </div>
                  </div>

                  {/* Bonuses */}
                  {bonusPoints > 0 && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Использовать бонусы
                        </label>
                        <Badge variant="secondary">{bonusPoints} б.</Badge>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого</span>
                    <span data-testid="text-total">{total.toFixed(2)} ₽</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
