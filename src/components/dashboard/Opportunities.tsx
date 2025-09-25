"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Info } from "lucide-react";

const opportunities = [
  { ticker: "PETR4", name: "Petrobras", score: 88 },
  { ticker: "VALE3", name: "Vale", score: 85 },
  { ticker: "ITUB4", name: "Itaú Unibanco", score: 82 },
  { ticker: "MGLU3", name: "Magazine Luiza", score: 76 },
];

export function Opportunities() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline">Principais Oportunidades</CardTitle>
        </div>
        <CardDescription>Recomendações via IA baseadas no seu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {opportunities.map((opp) => (
            <li key={opp.ticker} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{opp.ticker}</p>
                <p className="text-sm text-muted-foreground">{opp.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                    <p className="font-semibold">{opp.score}</p>
                    <p className="text-xs text-muted-foreground">Pontos</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
