
import { Suspense } from 'react';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MarketChart } from "@/components/dashboard/MarketChart";
import { MoversTable } from "@/components/dashboard/MoversTable";
import { Opportunities } from "@/components/dashboard/Opportunities";
import { TrendingUp, TrendingDown, Minus, DollarSign, Percent, BarChart, Activity, Briefcase } from "lucide-react";
import { BrokerLinks } from "@/components/dashboard/BrokerLinks";
import { AdCarousel } from "@/components/dashboard/AdCarousel";
import { getQuote } from '@/services/brapi';

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

  return (
    <div className="flex flex-1 flex-col gap-8">
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


export default function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData search={searchParams?.search} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return <div className="text-center p-8">Carregando dados do mercado...</div>;
}
