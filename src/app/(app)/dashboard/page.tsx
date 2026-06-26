
import { Suspense } from 'react';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MarketChart } from "@/components/dashboard/MarketChart";
import { MoversTable } from "@/components/dashboard/MoversTable";
import { Opportunities } from "@/components/dashboard/Opportunities";
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart, Activity, Briefcase, Database, Clock } from "lucide-react";
import { BrokerLinks } from "@/components/dashboard/BrokerLinks";
import { AdCarousel } from "@/components/dashboard/AdCarousel";
import { getQuote } from '@/services/brapi';
import { Badge } from '@/components/ui/badge';

async function DashboardData({ search }: { search?: string }) {
  // Busca dados de PETR4 como padrão, ou do ativo pesquisado
  const ticker = search?.toUpperCase() || 'PETR4';
  const quote = await getQuote(ticker);

  const formatCurrency = (value: number) => `R$${value.toFixed(2)}`;
  const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const changeIsPositive = quote ? quote.change > 0 : false;
  const changeIsNegative = quote ? quote.change < 0 : false;
  const changeIsNeutral = !quote || quote.change === 0;
  const usingRealData = Boolean(process.env.BRAPI_API_KEY);
  const updatedAt = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div className="flex flex-1 flex-col gap-8">
      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={usingRealData ? "success" : "secondary"} className="gap-1">
                <Database className="h-3.5 w-3.5" />
                {usingRealData ? "Dados reais via Brapi" : "Modo demonstração"}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3.5 w-3.5" />
                Atualizado em {updatedAt}
              </Badge>
            </div>
            <h1 className="font-headline text-3xl font-bold tracking-normal sm:text-4xl">
              Painel de análise quantitativa
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Monitore cotações, histórico, oportunidades, movimentações e indicadores para apoiar decisões com dados e regras transparentes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
            <div className="rounded-md border bg-muted/40 p-4">
              <BarChart className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Mercado B3</p>
              <p className="mt-1 text-xs text-muted-foreground">Ações, FIIs e ETFs</p>
            </div>
            <div className="rounded-md border bg-muted/40 p-4">
              <Activity className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Backtesting</p>
              <p className="mt-1 text-xs text-muted-foreground">Estratégias objetivas</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <MetricCard
          title={`Preço (${quote?.symbol || ticker})`}
          value={quote ? formatCurrency(quote.price) : "Indisponível"}
          change={quote ? formatPercent(quote.change) : "-"}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          changeIcon={changeIsPositive ? <TrendingUp /> : changeIsNegative ? <TrendingDown /> : <Minus />}
          changeColor={changeIsPositive ? 'text-success' : changeIsNegative ? 'text-destructive' : 'text-secondary-foreground'}
        />
        <MetricCard
          title="Volume"
          value={quote ? formatNumber(quote.volume) : "Indisponível"}
          change="nas últimas 24h"
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Variação Dia"
          value={quote ? formatCurrency(quote.dayLow) : "Indisponível"}
          change={`Max: ${quote ? formatCurrency(quote.dayHigh) : '-'}`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
         <MetricCard
          title="Market Cap"
          value={quote ? formatNumber(quote.marketCap) : "Indisponível"}
          change="Valor de mercado"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <MarketChart initialTicker={ticker} />
        </div>
        <div className="flex flex-col gap-6">
          <Opportunities />
          <MoversTable />
        </div>
      </div>
       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
         <div className="lg:col-span-2 flex flex-col gap-6">
            <AdCarousel />
         </div>
         <div className="flex flex-col gap-6">
            <BrokerLinks />
         </div>
      </div>
    </div>
  );
}


export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData search={params?.search} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return <div className="text-center p-8">Carregando dados do mercado...</div>;
}
