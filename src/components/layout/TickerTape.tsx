import { getQuote } from "@/services/brapi";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

async function getTickerData(tickers: string[]) {
    const promises = tickers.map(ticker => getQuote(ticker));
    const results = await Promise.all(promises);
    return results.filter(quote => quote !== null);
}

export async function TickerTape() {
    const tickers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "MGLU3", "WEGE3", "SUZB3", "ELET3", "B3SA3"];
    const quotes = await getTickerData(tickers);

    if (!quotes || quotes.length === 0) {
        return (
            <div className="bg-card border-b border-t">
                <div className="container mx-auto py-2 text-center text-sm text-muted-foreground">
                    Não foi possível carregar as cotações.
                </div>
            </div>
        );
    }
    
    const allQuotes = [...quotes, ...quotes];

    return (
        <div className="bg-card border-b border-t w-full overflow-hidden group [mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]">
            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
                {allQuotes.map((quote, index) => {
                    if (!quote) return null;
                    const isPositive = quote.change > 0;
                    const changeColor = isPositive ? 'text-success' : 'text-destructive';
                    
                    return (
                        <Link href={`/dashboard?search=${quote.symbol}`} key={`${quote.symbol}-${index}`} className="flex items-center flex-shrink-0 px-6 py-2 border-r hover:bg-muted/50 transition-colors">
                            <span className="font-bold text-base mr-3">{quote.symbol}</span>
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-sm">
                                    R$ {quote.price.toFixed(2)}
                                </span>
                                <div className={cn("flex items-center text-xs", changeColor)}>
                                    {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    <span className="ml-1">{quote.change.toFixed(2)}%</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
