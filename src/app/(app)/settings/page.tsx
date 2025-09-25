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
            <Briefcase className="w-4 h-4" /> Engenheiro de Software & Entusiasta do Mercado Financeiro
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center max-w-3xl mx-auto text-foreground/80 space-y-4">
          <p>
            Sou formado em Administração (ênfase em Sistemas de Informação) e Ciências Econômicas, com trajetória profissional que inclui experiências em corretoras, bancos e mercado de capitais. Atualmente, curso Engenharia de Software e pós-graduação em Big Data e Inteligência Artificial.
          </p>
          <p>
            Minha vivência no setor financeiro, aliada ao conhecimento em tecnologia, me permite desenvolver soluções que unem análise de dados, inteligência artificial e visão estratégica para identificar oportunidades no mercado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
