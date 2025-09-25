"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Loader2, Bell, Trash2, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";

const formSchema = z.object({
  ticker: z.string().min(1, { message: "O ativo deve ser selecionado." }),
  condition: z.enum(["price-above", "price-below"]),
  value: z.coerce.number().positive({ message: "O valor deve ser positivo." }),
});

type FormData = z.infer<typeof formSchema>;

type Alert = FormData & { id: string };

const conditionLabels: Record<FormData["condition"], string> = {
    "price-above": "Preço acima de",
    "price-below": "Preço abaixo de",
};

export function AlertsManager() {
    const [isPending, startTransition] = useTransition();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ticker: "",
            condition: "price-above",
            value: 0,
        },
    });

    function onSubmit(values: FormData) {
        startTransition(() => {
            const newAlert: Alert = { ...values, id: crypto.randomUUID() };
            setAlerts(prev => [...prev, newAlert]);
            form.reset();
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
                                                <SelectItem value="PETR4">PETR4 (Petrobras)</SelectItem>
                                                <SelectItem value="VALE3">VALE3 (Vale)</SelectItem>
                                                <SelectItem value="ITUB4">ITUB4 (Itaú Unibanco)</SelectItem>
                                                <SelectItem value="BBDC4">BBDC4 (Bradesco)</SelectItem>
                                                <SelectItem value="MGLU3">MGLU3 (Magazine Luiza)</SelectItem>
                                                <SelectItem value="BBAS3">BBAS3 (Banco do Brasil)</SelectItem>
                                                <SelectItem value="B3SA3">B3SA3 (B3)</SelectItem>
                                                <SelectItem value="ELET3">ELET3 (Eletrobras)</SelectItem>
                                                <SelectItem value="RENT3">RENT3 (Localiza)</SelectItem>
                                                <SelectItem value="WEGE3">WEGE3 (WEG)</SelectItem>
                                                <SelectItem value="ABEV3">ABEV3 (Ambev)</SelectItem>
                                                <SelectItem value="SUZB3">SUZB3 (Suzano)</SelectItem>
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
                        </CardContent>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Alertas Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                    {alerts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ativo</TableHead>
                                    <TableHead>Condição</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alerts.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell className="font-medium">{alert.ticker}</TableCell>
                                        <TableCell>{conditionLabels[alert.condition]}</TableCell>
                                        <TableCell className="text-right">{alert.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
