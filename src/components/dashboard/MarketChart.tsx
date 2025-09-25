
"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

const allChartData: Record<string, any[]> = {
  PETR4: [
    { date: "2024-07-01", price: 34.50, volume: 5000000 },
    { date: "2024-07-02", price: 34.80, volume: 6200000 },
    { date: "2024-07-03", price: 35.10, volume: 7100000 },
    { date: "2024-07-04", price: 34.90, volume: 4500000 },
    { date: "2024-07-05", price: 35.30, volume: 8000000 },
    { date: "2024-07-06", price: 35.70, volume: 7500000 },
    { date: "2024-07-07", price: 36.00, volume: 6800000 },
  ],
  VALE3: [
    { date: "2024-07-01", price: 61.20, volume: 4500000 },
    { date: "2024-07-02", price: 61.90, volume: 5800000 },
    { date: "2024-07-03", price: 62.50, volume: 6500000 },
    { date: "2024-07-04", price: 62.10, volume: 4100000 },
    { date: "2024-07-05", price: 62.80, volume: 7200000 },
    { date: "2024-07-06", price: 63.50, volume: 6900000 },
    { date: "2024-07-07", price: 63.90, volume: 6200000 },
  ],
  ITUB4: [
    { date: "2024-07-01", price: 32.10, volume: 8000000 },
    { date: "2024-07-02", price: 32.30, volume: 9200000 },
    { date: "2024-07-03", price: 32.60, volume: 8700000 },
    { date: "2024-07-04", price: 32.40, volume: 7500000 },
    { date: "2024-07-05", price: 32.80, volume: 9800000 },
    { date: "2024-07-06", price: 33.10, volume: 9400000 },
    { date: "2024-07-07", price: 33.30, volume: 8800000 },
  ],
   MGLU3: [
    { date: "2024-07-01", price: 12.50, volume: 15000000 },
    { date: "2024-07-02", price: 12.20, volume: 18000000 },
    { date: "2024-07-03", price: 12.90, volume: 21000000 },
    { date: "2024-07-04", price: 12.70, volume: 16000000 },
    { date: "2024-07-05", price: 13.10, volume: 25000000 },
    { date: "2024-07-06", price: 13.50, volume: 23000000 },
    { date: "2024-07-07", price: 13.80, volume: 20000000 },
  ],
  BBDC4: [
    { date: "2024-07-01", price: 12.80, volume: 11000000 },
    { date: "2024-07-02", price: 12.90, volume: 13000000 },
    { date: "2024-07-03", price: 13.10, volume: 12500000 },
    { date: "2024-07-04", price: 13.00, volume: 10000000 },
    { date: "2024-07-05", price: 13.20, volume: 14000000 },
    { date: "2024-07-06", price: 13.40, volume: 13500000 },
    { date: "2024-07-07", price: 13.60, volume: 12000000 },
  ],
  BBAS3: [
    { date: "2024-07-01", price: 26.80, volume: 11000000 },
    { date: "2024-07-02", price: 27.90, volume: 13000000 },
    { date: "2024-07-03", price: 27.10, volume: 12500000 },
    { date: "2024-07-04", price: 27.00, volume: 10000000 },
    { date: "2024-07-05", price: 27.20, volume: 14000000 },
    { date: "2024-07-06", price: 27.40, volume: 13500000 },
    { date: "2024-07-07", price: 27.60, volume: 12000000 },
  ],
  B3SA3: [
    { date: "2024-07-01", price: 10.80, volume: 11000000 },
    { date: "2024-07-02", price: 10.90, volume: 13000000 },
    { date: "2024-07-03", price: 11.10, volume: 12500000 },
    { date: "2024-07-04", price: 11.00, volume: 10000000 },
    { date: "2024-07-05", price: 11.20, volume: 14000000 },
    { date: "2024-07-06", price: 11.40, volume: 13500000 },
    { date: "2024-07-07", price: 11.60, volume: 12000000 },
  ],
  ELET3: [
    { date: "2024-07-01", price: 35.80, volume: 11000000 },
    { date: "2024-07-02", price: 35.90, volume: 13000000 },
    { date: "2024-07-03", price: 36.10, volume: 12500000 },
    { date: "2024-07-04", price: 36.00, volume: 10000000 },
    { date: "2024-07-05", price: 36.20, volume: 14000000 },
    { date: "2024-07-06", price: 36.40, volume: 13500000 },
    { date: "2024-07-07", price: 36.60, volume: 12000000 },
  ],
  RENT3: [
    { date: "2024-07-01", price: 44.80, volume: 11000000 },
    { date: "2024-07-02", price: 44.90, volume: 13000000 },
    { date: "2024-07-03", price: 45.10, volume: 12500000 },
    { date: "2024-07-04", price: 45.00, volume: 10000000 },
    { date: "2024-07-05", price: 45.20, volume: 14000000 },
    { date: "2024-07-06", price: 45.40, volume: 13500000 },
    { date: "2024-07-07", price: 45.60, volume: 12000000 },
  ],
  WEGE3: [
    { date: "2024-07-01", price: 39.80, volume: 11000000 },
    { date: "2024-07-02", price: 39.90, volume: 13000000 },
    { date: "2024-07-03", price: 40.10, volume: 12500000 },
    { date: "2024-07-04", price: 40.00, volume: 10000000 },
    { date: "2024-07-05", price: 40.20, volume: 14000000 },
    { date: "2024-07-06", price: 40.40, volume: 13500000 },
    { date: "2024-07-07", price: 40.60, volume: 12000000 },
  ],
  ABEV3: [
    { date: "2024-07-01", price: 12.80, volume: 11000000 },
    { date: "2024-07-02", price: 12.90, volume: 13000000 },
    { date: "2024-07-03", price: 13.10, volume: 12500000 },
    { date: "2024-07-04", price: 13.00, volume: 10000000 },
    { date: "2024-07-05", price: 13.20, volume: 14000000 },
    { date: "2024-07-06", price: 13.40, volume: 13500000 },
    { date: "2024-07-07", price: 13.60, volume: 12000000 },
  ],
  SUZB3: [
    { date: "2024-07-01", price: 50.80, volume: 11000000 },
    { date: "2024-07-02", price: 50.90, volume: 13000000 },
    { date: "2024-07-03", price: 51.10, volume: 12500000 },
    { date: "2024-0_04", price: 51.00, volume: 10000000 },
    { date: "2024-07-05", price: 51.20, volume: 14000000 },
    { date: "2024-07-06", price: 51.40, volume: 13500000 },
    { date: "2024-07-07", price: 51.60, volume: 12000000 },
  ],
};


const availableTickers = Object.keys(allChartData);

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function MarketChart({ initialTicker }: { initialTicker?: string }) {
  const [selectedTickers, setSelectedTickers] = useState([initialTicker || "PETR4"]);
  const [newTickerInput, setNewTickerInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialTicker && availableTickers.includes(initialTicker) && !selectedTickers.includes(initialTicker)) {
      setSelectedTickers(prev => [...prev, initialTicker]);
    }
  }, [initialTicker]);

  const chartData = allChartData.PETR4.map((_, index) => {
    const dataPoint: any = { date: allChartData.PETR4[index].date };
    selectedTickers.forEach(ticker => {
      if(allChartData[ticker] && allChartData[ticker][index]){
        dataPoint[ticker] = allChartData[ticker][index].price;
        if(selectedTickers.indexOf(ticker) === 0) {
          dataPoint.volume = allChartData[ticker][index].volume;
        }
      }
    });
    return dataPoint;
  });

  const chartConfig = selectedTickers.reduce((config, ticker, index) => {
    config[ticker] = {
      label: ticker,
      color: chartColors[index % chartColors.length],
    };
    return config;
  }, {} as any);

   chartConfig.volume = {
      label: "Volume",
      color: "hsl(var(--muted-foreground))",
    }

  const removeTicker = (tickerToRemove: string) => {
    if (selectedTickers.length > 1) {
      setSelectedTickers(prev => prev.filter(t => t !== tickerToRemove));
    }
    // If it's the last ticker, navigate to dashboard home
    if (selectedTickers.length === 1 && selectedTickers[0] === tickerToRemove) {
      router.push('/dashboard');
      setSelectedTickers(['PETR4']);
    }
  }

  const handleAddTicker = () => {
    const tickerToAdd = newTickerInput.toUpperCase();
    if(tickerToAdd && availableTickers.includes(tickerToAdd) && !selectedTickers.includes(tickerToAdd)) {
        setSelectedTickers(prev => [...prev, tickerToAdd]);
    }
    setNewTickerInput('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Desempenho de Ativos</CardTitle>
        <CardDescription>Compare o desempenho de diferentes ativos no mercado.</CardDescription>
         <div className="flex flex-wrap items-center gap-2 pt-2">
            {selectedTickers.map((ticker) => (
                <Badge 
                    key={ticker}
                    variant={"outline"}
                    className="flex items-center gap-2"
                >
                    <span style={{color: chartConfig[ticker]?.color}} className="font-bold">{ticker}</span>
                    <button onClick={() => removeTicker(ticker)} className="rounded-full hover:bg-muted">
                      <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 pt-2">
            <Input 
                type="text" 
                placeholder="Ex: VALE3"
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTicker()}
            />
            <Button type="button" onClick={handleAddTicker} size="sm">
                <PlusCircle className="mr-2" /> Adicionar
            </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-1">Ativos disponíveis para simulação: {availableTickers.join(', ')}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="6m">
            <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="5d">5D</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="6m">6M</TabsTrigger>
                <TabsTrigger value="1y">1A</TabsTrigger>
            </TabsList>
            <TabsContent value="6m">
                <div className="h-[450px] w-full">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                             <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--foreground))" tickFormatter={(value) => `R$${value}`} />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground))" dataKey="volume" tickFormatter={(value) => `${value / 1000000}M`} />
                            <ChartTooltip 
                              content={<ChartTooltipContent indicator="line" labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')} />} 
                            />
                            <Legend />
                             {selectedTickers.map((ticker, index) => (
                                <Line 
                                    key={ticker}
                                    type="monotone" 
                                    dataKey={ticker}
                                    stroke={chartColors[index % chartColors.length]}
                                    strokeWidth={2} 
                                    dot={false} 
                                    yAxisId="left" 
                                    name={ticker} 
                                />
                            ))}
                            <Bar dataKey="volume" fill="hsl(var(--muted-foreground)/50)" radius={4} yAxisId="right" name="Volume" />
                         </ComposedChart>
                    </ChartContainer>
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
