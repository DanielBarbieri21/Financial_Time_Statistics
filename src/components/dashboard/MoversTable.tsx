import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { getMarketMovers } from "@/services/brapi";
import type { MarketQuote } from "@/lib/market-types";

export async function MoversTable() {
  const { gainers, losers } = await getMarketMovers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Principais Movimentações</CardTitle>
        <CardDescription>Maiores variações entre os ativos monitorados.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers">Maiores Ganhos</TabsTrigger>
            <TabsTrigger value="losers">Maiores Perdas</TabsTrigger>
          </TabsList>
          <TabsContent value="gainers">
            <MoversList movers={gainers} type="gainer" />
          </TabsContent>
          <TabsContent value="losers">
            <MoversList movers={losers} type="loser" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MoversList({ movers, type }: { movers: MarketQuote[]; type: "gainer" | "loser" }) {
  if (movers.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Dados indisponíveis no momento.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ativo</TableHead>
          <TableHead className="text-right">Preço</TableHead>
          <TableHead className="text-right">Variação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movers.map((mover) => (
          <TableRow key={mover.symbol}>
            <TableCell className="font-medium">{mover.symbol}</TableCell>
            <TableCell className="text-right">{mover.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
            <TableCell className="text-right">
              <Badge variant={type === "gainer" ? "success" : "destructive"} className="text-xs">
                {mover.change.toFixed(2)}%
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
