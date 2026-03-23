# Mercado Insights - Plataforma de Análise Financeira com IA

## Link do Site: https://mercadoinsights.netlify.app/dashboard

Bem-vindo ao Mercado Insights, uma plataforma web moderna e interativa construída com Next.js, TypeScript e Tailwind CSS, projetada para fornecer análises aprofundadas do mercado financeiro brasileiro. A aplicação integra a API da Brapi para dados de mercado e utiliza o poder do Gemini para funcionalidades avançadas de inteligência artificial.

## ✨ Funcionalidades Principais

A plataforma oferece um conjunto robusto de ferramentas para investidores de todos os níveis:

### 1. **Dashboard Dinâmico**
- **Cotações em Tempo Real**: Uma barra de cotações (`TickerTape`) exibe os principais ativos do mercado com atualizações contínuas.
- **Busca de Ativos**: Pesquise qualquer ativo listado para atualizar dinamicamente todo o dashboard.
- **Métricas Essenciais**: Cards informativos com preço, volume, variação diária e valor de mercado do ativo selecionado.
- **Gráfico Comparativo**: Visualize e compare o desempenho histórico de múltiplos ativos simultaneamente em um gráfico interativo.
- **Principais Movimentações**: Tabelas que destacam as maiores altas e baixas do dia.
- **Oportunidades com IA**: Sugestões de investimento baseadas em análises de IA.

### 2. **Análise de Portfólio com IA**
- **Monte sua Carteira**: Adicione seus ativos e as respectivas quantidades.
- **Análise Inteligente**: Receba uma análise completa da sua carteira, com preços simulados, valor total, alocação percentual e um gráfico de pizza para visualização.
- **Recomendação da IA**: Um insight gerado por IA oferece uma breve recomendação sobre a diversificação e o perfil de risco do seu portfólio.

### 3. **Simulador de Renda Fixa**
- **Projeção de Rentabilidade**: Calcule a evolução do seu patrimônio em investimentos de renda fixa, informando valor inicial, aportes mensais, taxa de juros e período.
- **Visualização Gráfica**: Um gráfico de barras mostra a projeção do crescimento do seu investimento ao longo do tempo.

### 4. **Analisador de Notícias com IA**
- **Resumo e Sentimento**: Cole o texto de uma notícia financeira para que a IA gere um resumo conciso e classifique o sentimento como "positivo", "negativo" ou "neutro".

### 5. **Motor de Backtesting com IA**
- **Teste Estratégias**: Simule o desempenho de estratégias de negociação (seja uma estratégia personalizada ou um modelo pronto) em dados históricos simulados.
- **Relatório Completo**: Obtenha um relatório detalhado com resultado financeiro, balanço final, taxa de sucesso e um histórico de todas as transações executadas pela estratégia.

### 6. **Ferramentas Adicionais**
- **Gerenciador de Alertas**: Crie alertas de preço para ser notificado quando um ativo atingir um valor específico.
- **Simulador de Empréstimos**: Calcule parcelas, juros e o custo total de financiamentos.
- **Página "Sobre"**: Uma seção dedicada a apresentar o desenvolvedor do projeto.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Estilização**: Tailwind CSS, ShadCN UI para componentes
- **Gráficos**: Recharts
- **Inteligência Artificial**: Google Gemini via Genkit
- **Dados de Mercado**: Brapi API
- **Ícones**: Lucide React

---

## ⚙️ Configuração e Execução

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- Node.js (versão 20 ou superior)
- `pnpm` como gerenciador de pacotes

### 1. Clonar o Repositório

```bash
git clone https://github.com/DanielBarbieri21/Painel_Financeiro_IA.git
cd mercado-insights
```

### 2. Instalar as Dependências

Use `pnpm` para instalar todos os pacotes necessários:

```bash
pnpm install
```

### 3. Configurar as Variáveis de Ambiente

Para que a aplicação possa buscar os dados de mercado, você precisa de uma chave de API da Brapi.

1.  Acesse [brapi.dev](https://brapi.dev/), crie uma conta gratuita e obtenha seu token de API.
2.  Crie um arquivo chamado `.env` na raiz do projeto.
3.  Adicione sua chave de API a este arquivo:

    ```env
    BRAPI_API_KEY=sua-chave-de-api-aqui
    ```

### 4. Rodar o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:9002`.

---

## 📜 Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento com Next.js e Turbopack.
- `pnpm build`: Compila a aplicação para produção.
- `pnpm start`: Inicia o servidor de produção após o build.
- `pnpm lint`: Executa o linter para análise de código.

---

---

🛠️ **Software desenvolvido por Daniel Barbieri**  
Engenheiro de Software | Full Stack Developer  

Código construído com foco em eficiência, organização, escalabilidade e boas práticas de desenvolvimento.

🌐 GitHub: https://github.com/DanielBarbieri21  
💼 LinkedIn: https://www.linkedin.com/in/daniel-barbieri-4990462a/

---

