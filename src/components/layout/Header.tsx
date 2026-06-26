"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { BarChart3, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

export function Header() {
  const { setTheme } = useTheme();
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${searchQuery.trim().toUpperCase()}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-col gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur md:flex-row md:items-center md:px-6">
      <div className="flex flex-1 items-center justify-between gap-4 md:justify-start">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-headline text-xl leading-none">Mercado Insights</span>
            <span className="mt-1 hidden text-xs font-normal text-muted-foreground sm:block">Análise quantitativa para decisões financeiras</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-1 justify-center">
        <form onSubmit={handleSearch} className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Buscar ativo..."
            className="w-full rounded-lg bg-background pl-8 md:w-[260px] lg:w-[360px]"
          />
        </form>
      </div>
      
      <div className="absolute right-4 top-3 flex items-center justify-end gap-4 md:static md:flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
