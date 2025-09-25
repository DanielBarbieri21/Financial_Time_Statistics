"use client";

import { summarizeFinancialNews, type SummarizeFinancialNewsOutput } from "@/ai/flows/summarize-financial-news";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  articleContent: z.string().min(200, {
    message: "O artigo deve ter pelo menos 200 caracteres.",
  }),
});

export function NewsSummarizer() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<SummarizeFinancialNewsOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleContent: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
        try {
            const res = await summarizeFinancialNews(values);
            setResult(res);
        } catch (e) {
            setError("Ocorreu um erro ao resumir o artigo.");
            console.error(e);
        }
    });
  }
  
  const sentimentVariant = {
    positive: 'success',
    negative: 'destructive',
    neutral: 'secondary'
  } as const;

  const sentimentLabel = {
    positive: 'Positivo',
    negative: 'Negativo',
    neutral: 'Neutro'
  } as const;

  return (
    <Card className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Analisador de Notícias com IA
            </CardTitle>
            <CardDescription>
              Cole um artigo de notícias financeiras abaixo para obter um resumo e análise de sentimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="articleContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo do Artigo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cole o texto completo do artigo de notícias financeiras aqui..."
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {result && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Resultado da Análise</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Sentimento</h3>
                            <Badge variant={sentimentVariant[result.sentiment]}>{sentimentLabel[result.sentiment]}</Badge>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">Resumo</h3>
                            <p className="text-sm text-foreground/80">{result.summary}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analisar Artigo
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
