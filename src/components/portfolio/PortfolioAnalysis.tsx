"use client";

import { type AnalyzePortfolioOutput } from "@/lib/market-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Loader2, PieChart, Trash2, PlusCircle, AlertTriangle, FileText, ClipboardCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";
import { PortfolioChart } from "./PortfolioChart";
import { cn } from "@/lib/utils";
import { DEFAULT_TICKER_OPTIONS } from "@/services/market-data";

const assetSchema = z.object({
  ticker: z.string().min(1, { message: "O ativo é obrigatório." }),
  quantity: z.coerce.number().positive({ message: "A quantidade deve ser positiva." }),
});

const formSchema = z.object({
  assets: z.array(assetSchema),
});

type FormData = z.infer<typeof formSchema>;

export function PortfolioAnalysis() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<AnalyzePortfolioOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assets: [
        { ticker: "PETR4", quantity: 100 },
        { ticker: "VALE3", quantity: 50 },
        { ticker: "ITUB4", quantity: 200 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const onSubmit = async (values: FormData) => {
    setResult(null);
    setError(null);
    startTransition(async () => {
        try {
            const response = await fetch("/api/analyze-portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "A resposta do servidor não foi OK.");
            }

            const res = await response.json();
            setResult(res);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Ocorreu um erro ao analisar o portfólio.");
            console.error(e);
        }
    });
  };

  return (
    <div className="w-full max-w-6xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <PieChart className="w-6 h-6 text-primary" />
                                Meu Portfólio
                            </CardTitle>
                            <CardDescription>
                            Adicione ou remova os ativos da sua carteira para análise.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`assets.${index}.ticker`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className={cn(index !== 0 && "sr-only")}>Ativo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Ativo" />
                                                    </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DEFAULT_TICKER_OPTIONS.map(ticker => (
                                                            <SelectItem key={ticker.value} value={ticker.value}>{ticker.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`assets.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                 <FormLabel className={cn(index !== 0 && "sr-only")}>Quantidade</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Qtd." {...field} className="w-24" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}

                            <Button type="button" variant="outline" size="sm" onClick={() => append({ ticker: "", quantity: 0 })}>
                                <PlusCircle className="mr-2" /> Adicionar Ativo
                            </Button>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isPending || fields.length === 0} className="w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analisar Carteira
                            </Button>
                        </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 {isPending && (
                    <Card className="h-full flex flex-col items-center justify-center text-center">
                        <CardContent className="pt-6">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Analisando sua carteira...</p>
                        </CardContent>
                    </Card>
                )}

                {error && (
                  <Card className="h-full flex flex-col items-center justify-center text-center bg-destructive/10 border-destructive">
                      <CardHeader>
                          <CardTitle className="font-headline text-destructive">Erro na Análise</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                          <p className="text-destructive">{error}</p>
                      </CardContent>
                  </Card>
                )}
                
                {!isPending && !result && !error && (
                     <Card className="h-full flex flex-col items-center justify-center text-center">
                        <CardHeader>
                            <CardTitle className="font-headline">Análise de Portfólio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Seus resultados aparecerão aqui.</p>
                            <p className="text-sm text-muted-foreground/80">
                                Preencha sua carteira e clique em "Analisar" para começar.
                            </p>
                        </CardContent>
                    </Card>
                )}
                
                {result && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" />
                                Resultado da Análise
                            </CardTitle>
                             <CardDescription>
                                Uma visão geral da sua carteira com cotações reais e regras quantitativas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="bg-muted/50 p-4 rounded-lg text-center mb-6">
                                        <p className="text-sm text-muted-foreground">Valor Total da Carteira</p>
                                        <p className="text-3xl font-bold font-headline">
                                            {result.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                    <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                                            <ClipboardCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            <CardTitle className="text-amber-900 dark:text-amber-200 text-lg font-headline">Diagnóstico Quantitativo</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="list-disc space-y-1 pl-4 text-sm text-amber-800 dark:text-amber-300">
                                                {(result.diagnostics || [result.recommendation]).map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="h-[250px]">
                                    <PortfolioChart assets={result.assets} />
                                </div>
                            </div>
                           
                            <div>
                                <h3 className="font-headline text-lg mb-2">Composição da Carteira</h3>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ativo</TableHead>
                                                <TableHead className="text-right">Quantidade</TableHead>
                                                <TableHead className="text-right">Preço Atual</TableHead>
                                                <TableHead className="text-right">Valor Total</TableHead>
                                                <TableHead className="text-right">Alocação</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result.assets.map((asset) => (
                                                <TableRow key={asset.ticker}>
                                                    <TableCell className="font-medium">{asset.ticker}</TableCell>
                                                    <TableCell className="text-right">{asset.quantity}</TableCell>
                                                    <TableCell className="text-right">{asset.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                    <TableCell className="text-right font-semibold">{asset.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                                    <TableCell className="text-right">{asset.allocation.toFixed(2)}%</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                 <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Os preços vêm da API de mercado configurada e podem ter atraso conforme o provedor.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
