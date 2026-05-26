import {
  LayoutDashboard,
  ShoppingCart,
  Factory,
  BookOpen,
  Package,
  Truck,
  Wallet,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
}

export const mainNavigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "D" },
  { title: "Ventas", href: "/sales", icon: ShoppingCart, shortcut: "V" },
  { title: "Producción", href: "/production", icon: Factory, shortcut: "P" },
  { title: "Recetas", href: "/recipes", icon: BookOpen, shortcut: "R" },
  { title: "Ingredientes", href: "/ingredients", icon: Package, shortcut: "I" },
  { title: "Compras", href: "/purchases", icon: Truck, shortcut: "C" },
  { title: "Finanzas", href: "/finance", icon: Wallet, shortcut: "F" },
  { title: "Clientes", href: "/customers", icon: Users, shortcut: "L" },
  { title: "Configuración", href: "/settings", icon: Settings },
];

export const commandActions = [
  { label: "Nueva venta", href: "/sales/new", keywords: ["venta", "pos", "vender"] },
  { label: "Nueva compra", href: "/purchases/new", keywords: ["compra", "proveedor"] },
  { label: "Nueva receta", href: "/recipes/new", keywords: ["receta", "crear"] },
  { label: "Registrar producción", href: "/production", keywords: ["produccion", "orden"] },
  { label: "Ver ingredientes críticos", href: "/ingredients?filter=critical", keywords: ["stock", "critico", "bajo"] },
];
