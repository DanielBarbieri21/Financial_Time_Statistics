"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Bell, Trash2, PlusCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";
import { DEFAULT_TICKER_OPTIONS } from "@/services/market-data";
import type { MarketQuote } from "@/lib/market-types";

const formSchema = z.object({
  ticker: z.string().min(1, { message: "O ativo deve ser selecionado." }),
  condition: z.enum(["price-above", "price-below"]),
  value: z.coerce.number().positive({ message: "O valor deve ser positivo." }),
});

type FormData = z.infer<typeof formSchema>;

type Alert = FormData & {
    id: string;
    createdAt: string;
    currentPrice?: number;
    status: "triggered" | "watching" | "unavailable";
};

const conditionLabels: Record<FormData["condition"], string> = {
    "price-above": "Preço acima de",
    "price-below": "Preço abaixo de",
};

export function AlertsManager() {
    const [isPending, startTransition] = useTransition();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ticker: "",
            condition: "price-above",
            value: 0,
        },
    });

    useEffect(() => {
        const storedAlerts = window.localStorage.getItem("mercado-insights-alerts");

        if (storedAlerts) {
            setAlerts(JSON.parse(storedAlerts));
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("mercado-insights-alerts", JSON.stringify(alerts));
    }, [alerts]);

    function getAlertStatus(values: FormData, quote?: MarketQuote): Alert["status"] {
        if (!quote) return "unavailable";

        if (values.condition === "price-above") {
            return quote.price >= values.value ? "triggered" : "watching";
        }

        return quote.price <= values.value ? "triggered" : "watching";
    }

    function onSubmit(values: FormData) {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch(`/api/quote/${values.ticker}`);
                const quote: MarketQuote | undefined = response.ok ? await response.json() : undefined;
                const newAlert: Alert = {
                    ...values,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    currentPrice: quote?.price,
                    status: getAlertStatus(values, quote),
                };

                setAlerts(prev => [...prev, newAlert]);
                form.reset();
            } catch (submitError) {
                console.error(submitError);
                setError("Não foi possível validar a cotação atual do alerta.");
            }
        });
    }

    async function refreshAlert(alert: Alert) {
        try {
            const response = await fetch(`/api/quote/${alert.ticker}`);
            const quote: MarketQuote | undefined = response.ok ? await response.json() : undefined;

            setAlerts((prev) => prev.map((item) => (
                item.id === alert.id
                    ? { ...item, currentPrice: quote?.price, status: getAlertStatus(item, quote) }
                    : item
            )));
        } catch (refreshError) {
            console.error(refreshError);
            setAlerts((prev) => prev.map((item) => item.id === alert.id ? { ...item, status: "unavailable" } : item));
        }
    }

    function refreshAllAlerts() {
        startTransition(async () => {
            await Promise.all(alerts.map(refreshAlert));
        });
    }

    function deleteAlert(id: string) {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }

    return (
        <div className="w-full max-w-4xl space-y-8">
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Bell className="w-6 h-6 text-primary" />
                                Gerenciador de Alertas
                            </CardTitle>
                            <CardDescription>
                                Crie e gerencie alertas de preços para os ativos que você acompanha.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6 items-end">
                            <FormField
                                control={form.control}
                                name="ticker"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ativo</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um ativo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {DEFAULT_TICKER_OPTIONS.map((ticker) => (
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
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condição</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma condição" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="price-above">Preço Acima de</SelectItem>
                                                <SelectItem value="price-below">Preço Abaixo de</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Valor (R$)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 55,50" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle />}
                                    <span className="hidden sm:inline ml-2">Adicionar</span>
                                </Button>
                            </div>
                            {error && <p className="text-sm text-destructive md:col-span-3">{error}</p>}
                        </CardContent>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle className="font-headline text-xl">Alertas Ativos</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={refreshAllAlerts} disabled={isPending || alerts.length === 0}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar Cotações"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {alerts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ativo</TableHead>
                                    <TableHead>Condição</TableHead>
                                    <TableHead className="text-right">Preço Atual</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alerts.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell className="font-medium">{alert.ticker}</TableCell>
                                        <TableCell>{conditionLabels[alert.condition]}</TableCell>
                                        <TableCell className="text-right">
                                            {typeof alert.currentPrice === "number"
                                                ? alert.currentPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">{alert.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell className="text-right">
                                            {alert.status === "triggered" && <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /> Acionado</span>}
                                            {alert.status === "watching" && <span className="text-muted-foreground">Monitorando</span>}
                                            {alert.status === "unavailable" && <span className="inline-flex items-center gap-1 text-destructive"><AlertTriangle className="h-4 w-4" /> Indisponível</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Excluir</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <Bell className="mx-auto h-12 w-12" />
                            <p className="mt-4">Nenhum alerta ativo no momento.</p>
                            <p className="text-sm">Use o formulário acima para criar um novo alerta.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
