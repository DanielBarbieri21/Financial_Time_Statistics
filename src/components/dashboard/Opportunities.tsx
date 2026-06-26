import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, Info } from "lucide-react";
import { getQuantitativeOpportunities } from "@/services/brapi";
import { Button } from "../ui/button";

export async function Opportunities() {
  const opportunities = await getQuantitativeOpportunities();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle className="font-headline">Oportunidades Quantitativas</CardTitle>
        </div>
        <CardDescription>Score por momentum, liquidez, valuation, dividendos e risco.</CardDescription>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Dados indisponíveis no momento.</p>
        ) : (
          <ul className="space-y-4">
            {opportunities.map((opp) => (
              <li key={opp.ticker} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{opp.ticker}</p>
                  <p className="text-sm text-muted-foreground">{opp.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">{opp.score}</p>
                    <p className="text-xs text-muted-foreground">Pontos</p>
                  </div>
                  <Button variant="ghost" size="icon" title={opp.reasons.join(" ")}>
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
