"use client";

import { backtestStrategy, type BacktestStrategyOutput } from "@/ai/flows/backtesting-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Loader2, History } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, FileText, Wand2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";
import { Badge } from "../ui/badge";
import { BacktestResultsChart } from "./BacktestResultsChart";

const formSchema = z.object({
  strategy: z.string().min(10, {
    message: "A estratégia deve ter pelo menos 10 caracteres.",
  }),
  ticker: z.string().min(3, {
    message: "O ativo deve ser selecionado.",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "A data de início é obrigatória.",
    }),
    to: z.date({
      required_error: "A data de fim é obrigatória.",
    }),
  }),
});

type FormData = z.infer<typeof formSchema>;

const predefinedStrategies = {
    "rsi": "Comprar o ativo quando seu Índice de Força Relativa (IFR) de 14 dias cair abaixo de 30 (sobrevenda) e vender quando o IFR ultrapassar 70 (sobrecompra).",
    "moving-average-cross": "Comprar o ativo quando a média móvel curta de 9 dias cruzar para cima da média móvel longa de 21 dias. Vender quando a média curta cruzar para baixo da média longa.",
    "breakout": "Comprar o ativo quando seu preço ultrapassar o nível de resistência estabelecido nos últimos 20 dias. Vender se o preço cair 5% abaixo do ponto de compra (stop-loss).",
};

export function BacktestingEngine() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<BacktestStrategyOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategy: "",
      ticker: "PETR4",
      dateRange: {
        from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        to: new Date(),
      }
    },
  });

  function onSubmit(values: FormData) {
    setResult(null);
    setError(null);
    startTransition(async () => {
        try {
            const input = {
                strategy: values.strategy,
                ticker: values.ticker,
                startDate: values.dateRange.from.toISOString().split('T')[0],
                endDate: values.dateRange.to.toISOString().split('T')[0],
            }
            const res = await backtestStrategy(input);
            setResult(res);
        } catch (e) {
            setError("Ocorreu um erro ao executar o backtest.");
            console.error(e);
        }
    });
  }

  const handleStrategySelect = (value: keyof typeof predefinedStrategies) => {
    form.setValue("strategy", predefinedStrategies[value]);
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <History className="w-6 h-6 text-primary" />
                        Motor de Backtesting
                    </CardTitle>
                    <CardDescription>
                    Teste suas estratégias de negociação com dados simulados por IA ou use um modelo pronto.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Wand2 className="w-4 h-4"/> Modelos de Estratégia (Opcional)</FormLabel>
                            <Select onValueChange={handleStrategySelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma estratégia pronta..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rsi">IFR (Sobrevenda/Sobrecompra)</SelectItem>
                                    <SelectItem value="moving-average-cross">Cruzamento de Médias Móveis</SelectItem>
                                    <SelectItem value="breakout">Rompimento de Resistência</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>

                        <FormField
                        control={form.control}
                        name="strategy"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estratégia de Negociação</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Ex: Comprar quando o IFR de 14 dias for menor que 30 e vender quando for maior que 70."
                                className="resize-y min-h-[100px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="ticker"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ativo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um ativo" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PETR4">PETR4 (Petrobras)</SelectItem>
                                        <SelectItem value="VALE3">VALE3 (Vale)</SelectItem>
                                        <SelectItem value="ITUB4">ITUB4 (Itaú Unibanco)</SelectItem>
                                        <SelectItem value="BBDC4">BBDC4 (Bradesco)</SelectItem>
                                        <SelectItem value="MGLU3">MGLU3 (Magazine Luiza)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dateRange"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Período do Teste</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value.from && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value.from ? (
                                                field.value.to ? (
                                                    <>
                                                    {format(field.value.from, "LLL dd, y", { locale: ptBR })} -{" "}
                                                    {format(field.value.to, "LLL dd, y", { locale: ptBR })}
                                                    </>
                                                ) : (
                                                    format(field.value.from, "LLL dd, y", { locale: ptBR })
                                                )
                                                ) : (
                                                <span>Escolha um período</span>
                                            )}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="range"
                                                selected={{from: field.value.from, to: field.value.to}}
                                                onSelect={(range) => field.onChange(range || { from: new Date(), to: new Date() })}
                                                initialFocus
                                                numberOfMonths={2}
                                                locale={ptBR}
                                                disabled={(date) => date > new Date() || date < new Date("2010-01-01")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Executar Simulação
                    </Button>
                </CardFooter>
                </form>
            </Form>
        </Card>
        
        {isPending && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Simulando, isso pode levar um momento...</p>
            </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        
        {result && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Resultados do Backtest
                    </CardTitle>
                    <CardDescription>
                        Análise de performance da sua estratégia no período selecionado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Resultado Final</p>
                            <p className={`text-2xl font-bold ${result.summary.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {result.summary.totalProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(result.summary.totalProfit / result.summary.initialBalance * 100).toFixed(2)}%
                            </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total de Negociações</p>
                            <p className="text-2xl font-bold">{result.summary.totalTrades}</p>
                        </div>
                         <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                            <p className="text-2xl font-bold">{result.summary.winRate.toFixed(1)}%</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Balanço Final</p>
                            <p className="text-2xl font-bold">{result.summary.finalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </div>

                     <div>
                        <h3 className="font-headline text-lg mb-4">Evolução do Patrimônio</h3>
                        <BacktestResultsChart results={result} />
                    </div>

                    <div>
                        <h3 className="font-headline text-lg mb-2">Histórico de Transações</h3>
                        <div className="border rounded-lg max-h-[300px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Operação</TableHead>
                                        <TableHead>Ações</TableHead>
                                        <TableHead className="text-right">Preço</TableHead>
                                        <TableHead className="text-right">Balanço</TableHead>
                                        <TableHead className="hidden md:table-cell">Justificativa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.trades.map((trade, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(trade.date), "dd/MM/yyyy")}</TableCell>
                                            <TableCell>
                                                <Badge variant={trade.type === 'buy' ? 'success' : 'destructive'}>
                                                    {trade.type === 'buy' ? 'Compra' : 'Venda'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{trade.shares}</TableCell>
                                            <TableCell className="text-right">{trade.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell className="text-right">{trade.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{trade.reason}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
