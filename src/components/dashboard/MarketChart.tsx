"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { HistoricalPrice } from "@/lib/market-types";
import { DEFAULT_TICKERS } from "@/services/market-data";

type HistoryResponse = Record<string, HistoricalPrice[]>;

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const rangeLabels = {
  "5d": "5D",
  "1mo": "1M",
  "3mo": "3M",
  "6mo": "6M",
  "1y": "1A",
} as const;

export function MarketChart({ initialTicker }: { initialTicker?: string }) {
  const [selectedTickers, setSelectedTickers] = useState([initialTicker || "PETR4"]);
  const [newTickerInput, setNewTickerInput] = useState("");
  const [range, setRange] = useState<keyof typeof rangeLabels>("6mo");
  const [history, setHistory] = useState<HistoryResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialTicker && !selectedTickers.includes(initialTicker)) {
      setSelectedTickers((prev) => [...prev, initialTicker]);
    }
  }, [initialTicker, selectedTickers]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          tickers: selectedTickers.join(","),
          range,
          interval: "1d",
        });
        const response = await fetch(`/api/market/history?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar o histórico dos ativos.");
        }

        setHistory(await response.json());
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Erro ao carregar histórico.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [selectedTickers, range]);

  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, string | number>>();

    selectedTickers.forEach((ticker, tickerIndex) => {
      (history[ticker] || []).forEach((item) => {
        const row = dateMap.get(item.date) || { date: item.date };
        row[ticker] = item.close;

        if (tickerIndex === 0 && item.volume) {
          row.volume = item.volume;
        }

        dateMap.set(item.date, row);
      });
    });

    return Array.from(dateMap.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [history, selectedTickers]);

  const chartConfig = selectedTickers.reduce((config, ticker, index) => {
    config[ticker] = {
      label: ticker,
      color: chartColors[index % chartColors.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  chartConfig.volume = {
    label: "Volume",
    color: "hsl(var(--muted-foreground))",
  };

  const removeTicker = (tickerToRemove: string) => {
    if (selectedTickers.length > 1) {
      setSelectedTickers((prev) => prev.filter((ticker) => ticker !== tickerToRemove));
      return;
    }

    router.push("/dashboard");
    setSelectedTickers(["PETR4"]);
  };

  const handleAddTicker = () => {
    const tickerToAdd = newTickerInput.trim().toUpperCase();

    if (tickerToAdd && !selectedTickers.includes(tickerToAdd)) {
      setSelectedTickers((prev) => [...prev, tickerToAdd]);
    }

    setNewTickerInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Desempenho de Ativos</CardTitle>
        <CardDescription>Compare o histórico real de preços e volume dos ativos.</CardDescription>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {selectedTickers.map((ticker, index) => (
            <Badge key={ticker} variant="outline" className="flex items-center gap-2">
              <span style={{ color: chartColors[index % chartColors.length] }} className="font-bold">
                {ticker}
              </span>
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
            onChange={(event) => setNewTickerInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleAddTicker()}
          />
          <Button type="button" onClick={handleAddTicker} size="sm">
            <PlusCircle className="mr-2" /> Adicionar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          Sugestões: {DEFAULT_TICKERS.join(", ")}. Você também pode digitar outro ticker da B3.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={range} onValueChange={(value) => setRange(value as keyof typeof rangeLabels)}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {Object.entries(rangeLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="h-[450px] w-full">
            {isLoading && <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Carregando histórico...</div>}
            {!isLoading && error && <div className="flex h-full items-center justify-center text-sm text-destructive">{error}</div>}
            {!isLoading && !error && chartData.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sem histórico disponível para o período.</div>
            )}
            {!isLoading && !error && chartData.length > 0 && (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--foreground))" tickFormatter={(value) => `R$${value}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground))" tickFormatter={(value) => `${Number(value) / 1000000}M`} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" labelFormatter={(value) => new Date(value).toLocaleDateString("pt-BR")} />} />
                  <Legend />
                  {selectedTickers.map((ticker, index) => (
                    <Line key={ticker} type="monotone" dataKey={ticker} stroke={chartColors[index % chartColors.length]} strokeWidth={2} dot={false} yAxisId="left" name={ticker} />
                  ))}
                  <Bar dataKey="volume" fill="hsl(var(--muted-foreground)/50)" radius={4} yAxisId="right" name="Volume" />
                </ComposedChart>
              </ChartContainer>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
