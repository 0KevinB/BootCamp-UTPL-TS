"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Film, Globe, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Centro de Comando",
    icon: Home,
    description: "Vista general del tablero",
  },
  {
    href: "/pilots",
    label: "Identificador de Pilotos",
    icon: Search,
    description: "Búsqueda avanzada de pilotos",
  },
  {
    href: "/species",
    label: "Censo de Especies",
    icon: Film,
    description: "Análisis por película",
  },
  {
    href: "/planets",
    label: "Inteligencia Planetaria",
    icon: Globe,
    description: "Datos de planetas estratégicos",
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-yellow-400/20 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">RA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">Inteligencia Rebelde</h1>
              <p className="text-slate-400 text-xs">Home One - Sector de Comando</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-yellow-400/10 hover:text-yellow-400",
                    isActive ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30" : "text-slate-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
