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
import { useState } from "react";
import { Calculator, Percent, Calendar, DollarSign } from "lucide-react";

const formSchema = z.object({
  loanAmount: z.coerce
    .number()
    .positive({ message: "O valor deve ser positivo." }),
  interestRate: z.coerce
    .number()
    .positive({ message: "A taxa de juros deve ser positiva." }),
  loanTerm: z.coerce
    .number()
    .int()
    .positive({ message: "O prazo deve ser um número inteiro positivo." }),
});

type FormData = z.infer<typeof formSchema>;

type SimulationResult = {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
};

export function LoanSimulator() {
  const [result, setResult] = useState<SimulationResult | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 100000,
      interestRate: 10,
      loanTerm: 360,
    },
  });

  function onSubmit(values: FormData) {
    const principal = values.loanAmount;
    const monthlyRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
        monthlyPayment =
        principal *
        ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1));
    } else {
        monthlyPayment = principal / numberOfPayments;
    }

    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - principal;

    setResult({
      monthlyPayment,
      totalInterest,
      totalCost,
    });
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Simulador de Empréstimos
              </CardTitle>
              <CardDescription>
                Calcule seu empréstimo ou financiamento para planejar suas finanças.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Empréstimo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 300000" {...field} />
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
                    <FormLabel>Taxa de Juros Anual (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 9.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo (em meses)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 360" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Calcular</Button>
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
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                <p className="text-2xl font-bold">
                  {result.monthlyPayment.toLocaleString("pt-BR", {
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
                <p className="text-sm text-muted-foreground">Total de Juros</p>
                <p className="text-2xl font-bold">
                  {result.totalInterest.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custo Total</p>
                <p className="text-2xl font-bold">
                  {result.totalCost.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
