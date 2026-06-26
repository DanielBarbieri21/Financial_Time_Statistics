# Mercado Insights - Plataforma de Análise Financeira Quantitativa

## Link do Site

https://mercadoinsights.netlify.app/dashboard

Mercado Insights é uma plataforma web construída com Next.js, TypeScript e Tailwind CSS para análise do mercado financeiro brasileiro com dados de APIs e cálculos determinísticos, sem dependência de modelos de IA pagos.

## Funcionalidades Principais

### 1. Dashboard Dinâmico
- Cotações de ativos via Brapi.
- Busca de ativos para atualizar métricas do dashboard.
- Cards com preço, volume, variação diária e valor de mercado.
- Gráfico histórico comparativo com dados reais.
- Maiores altas e baixas entre os ativos monitorados.
- Oportunidades quantitativas por score de momentum, liquidez, valuation, dividendos e risco.

### 2. Análise de Portfólio
- Carteira com ativos e quantidades.
- Preço atual, valor total, alocação, setor e tipo de ativo.
- Diagnóstico por regras claras de concentração, exposição e risco.

### 3. Simulador de Renda Fixa
- Projeção com juros compostos.
- Taxa manual ou indicadores públicos do Banco Central, como Selic, CDI e IPCA.

### 4. Triagem de Notícias
- Classificação local por termos positivos e negativos.
- Sem envio de texto para provedores de IA.

### 5. Backtesting
- Estratégias fixas executadas sobre histórico real de preços.
- IFR, cruzamento de médias móveis e rompimento de resistência.
- Resultado financeiro, saldo final, taxa de sucesso e histórico de transações.

### 6. Alertas
- Alertas de preço persistidos no navegador.
- Validação contra cotação atual da API.

## Tecnologias

- Next.js 15, React 18 e TypeScript.
- Tailwind CSS e ShadCN UI.
- Recharts.
- Brapi para dados de mercado.
- Banco Central do Brasil para indicadores macroeconômicos.

## Configuração

### Pré-requisitos

- Node.js 20 ou superior.
- npm.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
BRAPI_API_KEY=sua-chave-de-api-aqui
```

### Execução

```bash
npm install
npm run dev
```

A aplicação roda em `http://localhost:9002`.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: compila a aplicação para produção.
- `npm run start`: inicia o servidor de produção após o build.
- `npm run typecheck`: valida TypeScript.

## Observação

As análises são informativas e baseadas em regras quantitativas simples. Elas não são recomendação individualizada de investimento.
