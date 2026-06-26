"use client";

import {
  Bell,
  History,
  Home,
  Newspaper,
  Calculator,
  PieChart,
  User,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/portfolio", icon: PieChart, label: "Análise de Portfólio" },
  { href: "/fixed-income", icon: Landmark, label: "Simulador de Renda Fixa" },
  { href: "/news", icon: Newspaper, label: "Triagem de Notícias" },
  { href: "/backtesting", icon: History, label: "Backtesting" },
  { href: "/alerts", icon: Bell, label: "Alertas" },
  { href: "/financing", icon: Calculator, label: "Simulador de Empréstimos" },
  { href: "/settings", icon: User, label: "Sobre o Desenvolvedor" },
];
