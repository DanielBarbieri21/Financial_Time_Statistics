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

const gainers = [
  { ticker: "XYZ", price: "R$150,75", change: "+5.20%", volume: "12.5M" },
  { ticker: "ABC", price: "R$34,20", change: "+4.80%", volume: "8.2M" },
  { ticker: "LMN", price: "R$210,00", change: "+3.50%", volume: "20.1M" },
  { ticker: "PQR", price: "R$88,50", change: "+3.10%", volume: "5.6M" },
];

const losers = [
  { ticker: "DEF", price: "R$45,30", change: "-6.10%", volume: "15.3M" },
  { ticker: "GHI", price: "R$12,80", change: "-5.50%", volume: "9.8M" },
  { ticker: "JKL", price: "R$155,20", change: "-4.20%", volume: "11.2M" },
  { ticker: "MNO", price: "R$72,40", change: "-3.80%", volume: "7.1M" },
];

export function MoversTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Principais Movimentações</CardTitle>
        <CardDescription>Maiores variações do mercado hoje.</CardDescription>
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


function MoversList({ movers, type }: { movers: typeof gainers, type: 'gainer' | 'loser' }) {
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
                    <TableRow key={mover.ticker}>
                        <TableCell className="font-medium">{mover.ticker}</TableCell>
                        <TableCell className="text-right">{mover.price}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant={type === 'gainer' ? 'success' : 'destructive'} className="text-xs">
                                {mover.change}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
