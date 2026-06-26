"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex items-start justify-center">
      <Card className="w-full max-w-4xl mt-8">
        <CardHeader className="items-center text-center">
          <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
            <AvatarImage src="/Perfil.jpg" />
            <AvatarFallback>DB</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-3xl">
            Daniel Barbieri
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Engenheiro de Software | Backend, Cloud & Tecnologia para o Mercado Financeiro
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-3xl mx-auto text-foreground/80 space-y-4">
          <p>
            Sou graduado em Administração com ênfase em Sistemas de Informação e em Ciências Econômicas, com experiência profissional no setor financeiro, incluindo corretoras, instituições bancárias e mercado de capitais. Atualmente, estou concluindo a graduação em Engenharia de Software e cursando pós-graduação em Big Data e Inteligência Artificial.
          </p>
          <p>
            Minha trajetória combina uma sólida compreensão do mercado financeiro com expertise em desenvolvimento de software, computação em nuvem e análise de dados. Atuo no desenvolvimento de soluções que integram tecnologia, inteligência artificial e automação para otimizar processos, apoiar decisões estratégicas e gerar valor para o negócio.
          </p>
          <p>
            Tenho conhecimentos em Java, Spring Boot, Node.js, React, APIs REST, bancos de dados SQL/NoSQL e AWS (Cloud Practitioner), além de interesse contínuo em arquitetura de software, microsserviços, engenharia de dados e IA aplicada. Busco desenvolver soluções escaláveis, seguras e orientadas a resultados, conectando tecnologia e negócios para impulsionar inovação e eficiência.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
