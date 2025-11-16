import { Link, useLocation } from "wouter"
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  Tag,
  BarChart3,
  MessageSquare,
  Home,
  LogOut
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Товары",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Категории",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Заказы",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Промокоды",
    href: "/admin/promocodes",
    icon: Tag,
  },
  {
    title: "Статистика",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Поддержка",
    href: "/admin/support",
    icon: MessageSquare,
  },
]

export function AppSidebarAdmin() {
  const [location] = useLocation()

  const handleLogout = () => {
    // TODO: Implement logout
    window.location.href = "/"
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold">
            Админ-панель
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location === item.href
                const testId = `link-admin-${item.href.split('/').pop()}`

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={testId}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="link-to-site">
              <Link href="/">
                <Home />
                <span>На сайт</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} data-testid="button-admin-logout">
              <LogOut />
              <span>Выйти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
