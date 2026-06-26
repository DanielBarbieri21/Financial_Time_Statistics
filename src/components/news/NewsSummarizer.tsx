"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Badge } from "../ui/badge";

type NewsAnalysisOutput = {
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
};

const formSchema = z.object({
  articleContent: z.string().min(200, {
    message: "O artigo deve ter pelo menos 200 caracteres.",
  }),
});

const positiveTerms = [
  "alta",
  "lucro",
  "crescimento",
  "recorde",
  "supera",
  "valorização",
  "dividendos",
  "expansão",
  "receita",
  "otimismo",
];

const negativeTerms = [
  "queda",
  "prejuízo",
  "retração",
  "corte",
  "risco",
  "dívida",
  "investigação",
  "perda",
  "inflação",
  "juros altos",
];

function analyzeNews(articleContent: string): NewsAnalysisOutput {
  const normalized = articleContent.toLowerCase();
  const positiveHits = positiveTerms.filter((term) => normalized.includes(term));
  const negativeHits = negativeTerms.filter((term) => normalized.includes(term));
  const sentiment =
    positiveHits.length > negativeHits.length
      ? "positive"
      : negativeHits.length > positiveHits.length
        ? "negative"
        : "neutral";
  const sentences = articleContent
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, 3).join(" ");

  return {
    summary,
    sentiment,
    keywords: [...positiveHits, ...negativeHits],
  };
}

export function NewsSummarizer() {
  const [result, setResult] = useState<NewsAnalysisOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleContent: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(analyzeNews(values.articleContent));
  }
  
  const sentimentVariant = {
    positive: "success",
    negative: "destructive",
    neutral: "secondary",
  } as const;

  const sentimentLabel = {
    positive: "Positivo",
    negative: "Negativo",
    neutral: "Neutro",
  } as const;

  return (
    <Card className="w-full max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Triagem de Notícias
            </CardTitle>
            <CardDescription>
              Cole uma notícia financeira para classificar sinais positivos e negativos por regras locais.
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
                  <CardTitle className="text-lg font-headline">Resultado da Triagem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Sentimento por regras</h3>
                    <Badge variant={sentimentVariant[result.sentiment]}>{sentimentLabel[result.sentiment]}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Trecho inicial</h3>
                    <p className="text-sm text-foreground/80">{result.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Termos encontrados</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.keywords.length > 0 ? result.keywords.join(", ") : "Nenhum termo relevante encontrado."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">Analisar Texto</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
