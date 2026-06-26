"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="border-b bg-card">
      {/* Mobile Menu */}
      <div className="md:hidden p-2 flex justify-end">
        <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
               <div className="grid gap-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      { "bg-muted text-primary": pathname.startsWith(item.href) }
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden h-14 items-center justify-center md:flex">
        <div className="flex items-center gap-1 text-sm lg:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
