'use server';

export type BcbIndicatorCode = "selic" | "cdi" | "ipca";

export type BcbIndicator = {
  code: BcbIndicatorCode;
  name: string;
  value: number;
  date: string;
  annualizedRate: number;
};

const SERIES: Record<BcbIndicatorCode, { sgs: number; name: string; annualize: boolean }> = {
  selic: { sgs: 11, name: "Selic diária", annualize: true },
  cdi: { sgs: 12, name: "CDI diário", annualize: true },
  ipca: { sgs: 433, name: "IPCA mensal", annualize: false },
};

type BcbSeriesResponse = {
  data: string;
  valor: string;
};

function annualizeDailyRate(value: number) {
  return (Math.pow(1 + value / 100, 252) - 1) * 100;
}

export async function getBcbIndicator(code: BcbIndicatorCode): Promise<BcbIndicator | null> {
  const config = SERIES[code];
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${config.sgs}/dados/ultimos/1?formato=json`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      console.error(`Erro ao buscar indicador BCB ${code}: ${response.statusText}`);
      return null;
    }

    const [latest]: BcbSeriesResponse[] = await response.json();
    const value = Number(String(latest?.valor || "0").replace(",", "."));

    return {
      code,
      name: config.name,
      value,
      date: latest?.data || "",
      annualizedRate: config.annualize ? annualizeDailyRate(value) : value,
    };
  } catch (error) {
    console.error(`Erro ao buscar indicador BCB ${code}:`, error);
    return null;
  }
}

export async function getMacroIndicators() {
  const indicators = await Promise.all([
    getBcbIndicator("selic"),
    getBcbIndicator("cdi"),
    getBcbIndicator("ipca"),
  ]);

  return indicators.filter((indicator): indicator is BcbIndicator => Boolean(indicator));
}
