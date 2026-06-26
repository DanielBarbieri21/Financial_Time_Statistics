"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Briefcase,
  Building2,
  Cloud,
  Code2,
  Database,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  ServerCog,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const skills = [
  { icon: ServerCog, title: "Backend", text: "Java, Spring Boot, Node.js, APIs REST e integrações." },
  { icon: Cloud, title: "Cloud", text: "AWS Cloud Practitioner, arquitetura e serviços em nuvem." },
  { icon: BarChart3, title: "Mercado Financeiro", text: "Vivência com corretoras, bancos e mercado de capitais." },
  { icon: Database, title: "Dados", text: "SQL, NoSQL, Big Data, automação e análise orientada a decisão." },
  { icon: ShieldCheck, title: "Arquitetura", text: "Soluções escaláveis, seguras e orientadas a resultado." },
  { icon: Code2, title: "Frontend", text: "React, TypeScript e interfaces para produtos financeiros." },
];

const timeline = [
  {
    icon: Building2,
    title: "Base em negócios e mercado",
    text: "Formação em Administração com ênfase em Sistemas de Informação e experiência em instituições financeiras.",
  },
  {
    icon: TrendingUp,
    title: "Ciências Econômicas",
    text: "Leitura de mercado, indicadores, risco, produtos financeiros e tomada de decisão baseada em dados.",
  },
  {
    icon: GraduationCap,
    title: "Engenharia de Software",
    text: "Graduação em conclusão, com foco em backend, APIs, arquitetura, qualidade e cloud.",
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.35fr]">
          <div className="border-b bg-card p-8 text-card-foreground sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Avatar className="h-36 w-36 border-4 border-border shadow-xl">
                <AvatarImage src="/Perfil.jpg" />
                <AvatarFallback>DB</AvatarFallback>
              </Avatar>
              <div className="mt-6 space-y-3">
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">IronDev Software</Badge>
                <h1 className="font-headline text-4xl font-bold tracking-normal sm:text-5xl">
                  Daniel Barbieri
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                  Engenheiro de Software | Backend, Cloud & Tecnologia para o Mercado Financeiro
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button asChild variant="secondary">
                  <Link href="https://github.com/DanielBarbieri21" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="https://www.linkedin.com/in/daniel-barbieri-4990462a" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="mailto:dibarbieri21@gmail.com">
                    <Mail className="mr-2 h-4 w-4" /> Contato
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Briefcase className="h-4 w-4" />
              Perfil Profissional
            </div>
            <div className="space-y-5 text-base leading-8 text-foreground/80">
              <p>
                Sou graduado em Administração com ênfase em Sistemas de Informação e em Ciências Econômicas, com experiência profissional no setor financeiro, incluindo corretoras, instituições bancárias e mercado de capitais. Atualmente, estou concluindo a graduação em Engenharia de Software e cursando pós-graduação em Big Data e Inteligência Artificial.
              </p>
              <p>
                Minha trajetória combina uma sólida compreensão do mercado financeiro com expertise em desenvolvimento de software, computação em nuvem e análise de dados. Atuo no desenvolvimento de soluções que integram tecnologia, inteligência artificial e automação para otimizar processos, apoiar decisões estratégicas e gerar valor para o negócio.
              </p>
              <p>
                Tenho conhecimentos em Java, Spring Boot, Node.js, React, APIs REST, bancos de dados SQL/NoSQL e AWS (Cloud Practitioner), além de interesse contínuo em arquitetura de software, microsserviços, engenharia de dados e IA aplicada. Busco desenvolver soluções escaláveis, seguras e orientadas a resultados, conectando tecnologia e negócios para impulsionar inovação e eficiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill.title} className="border-border/70 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <skill.icon className="h-5 w-5" />
              </div>
              <CardTitle className="font-headline text-lg">{skill.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {skill.text}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Trajetória</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {timeline.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Foco Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              Desenvolver produtos financeiros com dados confiáveis, automação, APIs bem estruturadas e experiências digitais úteis para análise e tomada de decisão.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Backend", "Cloud", "APIs", "Dados", "Mercado Financeiro", "IA Aplicada"].map((item) => (
                <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
