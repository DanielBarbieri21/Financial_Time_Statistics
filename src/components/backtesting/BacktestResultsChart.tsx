"use client";

import type { BacktestStrategyOutput } from "@/lib/market-types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  date: string;
  balance: number;
  type?: "buy" | "sell";
};

const chartConfig = {
  balance: {
    label: "Patrimônio",
    color: "hsl(var(--chart-1))",
  },
};

export function BacktestResultsChart({
  results,
}: {
  results: BacktestStrategyOutput;
}) {
  const chartData: ChartData[] = [
    {
      date: results.trades[0]?.date ? new Date(results.trades[0].date).toISOString() : new Date().toISOString(),
      balance: results.summary.initialBalance,
    },
    ...results.trades.map((trade) => ({
      date: new Date(trade.date).toISOString(),
      balance: trade.balance,
      type: trade.type,
    })),
  ];

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-balance)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-balance)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => format(new Date(value), "dd/MM")}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              `R$${Number(value).toLocaleString("pt-BR", {
                maximumFractionDigits: 0,
              })}`
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => format(new Date(label), "dd/MM/yyyy", { locale: ptBR })}
                formatter={(value) =>
                  `R$${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="balance"
            type="natural"
            fill="url(#fillBalance)"
            stroke="var(--color-balance)"
            stackId="a"
          />
          {results.trades.map((trade, index) => (
            <ReferenceDot
              key={index}
              x={new Date(trade.date).toISOString()}
              y={trade.balance}
              r={5}
              fill={trade.type === "buy" ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
            </ReferenceDot>
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
