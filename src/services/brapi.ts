/**
 * @fileOverview Service to interact with the Brapi API.
 */
'use server';

type QuoteResponse = {
    symbol: string;
    shortName: string;
    longName: string;
    currency: string;
    regularMarketPrice: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketDayRange: string;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketTime: string;
    marketCap: number;
    regularMarketVolume: number;
    regularMarketOpen: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    priceEarnings: number;
    earningsPerShare: number;
    logourl: string;
};

type MappedQuote = {
    symbol: string;
    name: string;
    price: number;
    dayHigh: number;
    dayLow: number;
    change: number;
    marketCap: number;
    volume: number;
    logoUrl: string;
}

const mapQuoteData = (data: QuoteResponse): MappedQuote => ({
    symbol: data.symbol,
    name: data.longName || data.shortName,
    price: data.regularMarketPrice,
    dayHigh: data.regularMarketDayHigh,
    dayLow: data.regularMarketDayLow,
    change: data.regularMarketChangePercent,
    marketCap: data.marketCap,
    volume: data.regularMarketVolume,
    logoUrl: data.logourl,
});

/**
 * Fetches quote data for a given stock ticker.
 * @param ticker The stock ticker symbol (e.g., "PETR4").
 * @returns A promise that resolves to the mapped quote data, or null if an error occurs.
 */
export async function getQuote(ticker: string): Promise<MappedQuote | null> {
    const apiKey = process.env.BRAPI_API_KEY;
    if (!apiKey) {
        console.error('BRAPI_API_KEY environment variable is not set.');
        return null;
    }

    const url = `https://brapi.dev/api/quote/${ticker}?token=${apiKey}`;

    try {
        const response = await fetch(url, {
             next: { revalidate: 300 } // Revalidate cache every 5 minutes
        });
        
        if (!response.ok) {
            console.error(`Error fetching data from Brapi: ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return mapQuoteData(data.results[0]);
        }
        
        return null;
    } catch (error) {
        console.error('An error occurred while fetching from Brapi:', error);
        return null;
    }
}
