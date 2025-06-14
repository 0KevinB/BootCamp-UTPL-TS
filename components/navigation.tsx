"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Centro de Comando",
  },
  {
    href: "/pilots",
    label: "Identificador de Pilotos",
  },
  {
    href: "/species",
    label: "Censo de Especies",
  },
  {
    href: "/planets",
    label: "Inteligencia Planetaria",
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-yellow-400/20 bg-black/80 backdrop-blur-md sticky top-0 z-50 shadow-md shadow-yellow-400/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo Rebelde */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Rebelión"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 tracking-wider drop-shadow">
                Centro de control
              </h1>
              <p className="text-white text-xs font-mono">
                Home One - Sector de Comando
              </p>
            </div>
          </Link>

          {/* Navegación */}
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-xs uppercase font-medium tracking-widest px-3 py-1 rounded-md transition-all duration-200",
                    "hover:text-yellow-400 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.6)] hover:bg-yellow/5",
                    isActive
                      ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] bg-yellow-400/10 border border-yellow-400/10"
                      : "text-yellow-400/60"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
