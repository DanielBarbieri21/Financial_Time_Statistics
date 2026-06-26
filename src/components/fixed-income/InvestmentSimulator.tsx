"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { TrendingUp, Percent, Calendar, DollarSign, PiggyBank } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type MacroIndicator = {
  code: "selic" | "cdi" | "ipca";
  name: string;
  value: number;
  date: string;
  annualizedRate: number;
};

const formSchema = z.object({
  initialAmount: z.coerce
    .number()
    .min(0, { message: "O valor inicial deve ser positivo." }),
  monthlyAmount: z.coerce
    .number()
    .min(0, { message: "O aporte mensal deve ser positivo." }),
  interestRate: z.coerce
    .number()
    .positive({ message: "A taxa de juros deve ser positiva." }),
  period: z.coerce
    .number()
    .int()
    .positive({ message: "O período deve ser um número inteiro positivo." }),
});

type FormData = z.infer<typeof formSchema>;

type SimulationResult = {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
  monthlyData: { month: number; value: number }[];
};

export function InvestmentSimulator() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [selectedRate, setSelectedRate] = useState("manual");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 1000,
      monthlyAmount: 200,
      interestRate: 10,
      period: 120, // 10 years
    },
  });

  useEffect(() => {
    async function loadIndicators() {
      try {
        const response = await fetch("/api/macroeconomics");

        if (!response.ok) return;

        setIndicators(await response.json());
      } catch (error) {
        console.error("Erro ao carregar indicadores do Banco Central:", error);
      }
    }

    loadIndicators();
  }, []);

  function handleRateSourceChange(value: string) {
    setSelectedRate(value);

    if (value === "manual") return;

    const indicator = indicators.find((item) => item.code === value);

    if (indicator) {
      form.setValue("interestRate", Number(indicator.annualizedRate.toFixed(2)));
    }
  }

  function onSubmit(values: FormData) {
    const monthlyRate = values.interestRate / 100 / 12;
    const monthlyData: { month: number; value: number }[] = [];
    let currentAmount = values.initialAmount;

    monthlyData.push({ month: 0, value: currentAmount });

    for (let i = 1; i <= values.period; i++) {
      currentAmount = (currentAmount + values.monthlyAmount) * (1 + monthlyRate);
      monthlyData.push({ month: i, value: parseFloat(currentAmount.toFixed(2)) });
    }
    
    const totalInvested = values.initialAmount + values.monthlyAmount * values.period;
    const totalInterest = currentAmount - totalInvested;

    setResult({
      finalAmount: currentAmount,
      totalInvested,
      totalInterest,
      monthlyData,
    });
  }

  const chartConfig = {
    value: {
      label: "Patrimônio",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="w-full max-w-6xl space-y-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Simulador de Investimentos
              </CardTitle>
              <CardDescription>
                Projete renda fixa com juros compostos e indicadores públicos do Banco Central.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aporte Mensal (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rentabilidade Anual (%)</FormLabel>
                    <Select value={selectedRate} onValueChange={handleRateSourceChange}>
                      <SelectTrigger className="mb-2">
                        <SelectValue placeholder="Fonte da taxa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Taxa manual</SelectItem>
                        {indicators.map((indicator) => (
                          <SelectItem key={indicator.code} value={indicator.code}>
                            {indicator.name}: {indicator.annualizedRate.toFixed(2)}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período (em meses)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Calcular Rentabilidade</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Resultado da Simulação
            </CardTitle>
            <CardDescription>
              Projeção para um período de {form.getValues("period")} meses com rentabilidade de {form.getValues("interestRate")}% a.a.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Valor Final Bruto</p>
                    <p className="text-2xl font-bold">
                    {result.finalAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    </p>
                </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <PiggyBank className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-2xl font-bold">
                    {result.totalInvested.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    </p>
                </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Percent className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total em Juros</p>
                    <p className="text-2xl font-bold">
                    {result.totalInterest.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    </p>
                </div>
                </div>
            </div>

            <div>
                <h3 className="font-headline text-lg mb-4">Evolução do Patrimônio</h3>
                <div className="h-[300px] w-full">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <BarChart data={result.monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickFormatter={(value) => `Mês ${value}`} tickMargin={10} />
                            <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
                            <ChartTooltip
                                cursor={false}
                                content={
                                <ChartTooltipContent
                                    labelFormatter={(label) => `Mês ${label}`}
                                    formatter={(value) =>
                                    Number(value).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })
                                    }
                                    indicator="dot"
                                />
                                }
                            />
                            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
