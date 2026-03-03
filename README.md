# 🩺 Calculadora de Faturamento MedGM

Calculadora interativa para médicos projetarem e otimizarem o faturamento de seus consultórios, desenvolvida seguindo a identidade visual da MedGM.

## 🎯 Sobre o Projeto

Esta ferramenta ajuda médicos a:
- **Simular cenários** de faturamento em tempo real
- **Identificar oportunidades** de crescimento através de duas alavancas principais:
  - Mix particular/convênio
  - Taxa de conversão da recepção
- **Visualizar o gap** entre faturamento atual e potencial otimizado
- **Tomar decisões** baseadas em dados sobre captação e conversão

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animações)
- **Zustand** (gerenciamento de estado)
- **Lucide React** (ícones)

## 🎨 Identidade Visual

Segue fielmente a identidade visual MedGM:

**Cores:**
- `#F5F5F5` (Clean) - Background principal
- `#D6B991` (Gold) - Elementos de destaque
- `#2B2B2B` (Dark Gray) - Cards escuros
- `#151515` (Black) - Textos principais

**Tipografia:**
- Inter (fallback do Gilroy, mantendo a elegância)

## 📁 Estrutura do Projeto

```
calculadora-medgm/
├── app/
│   ├── page.tsx              # Etapa 2: Sliders interativos
│   ├── resultado/
│   │   └── page.tsx          # Etapa 3: Análise e gap anualizado
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── SliderCard.tsx        # Slider customizado com animação
│   └── FaturamentoDisplay.tsx # Box de faturamento (lado direito)
├── lib/
│   ├── store.ts              # Zustand store + cálculos
│   └── utils.ts              # Helpers
└── README.md
```

## 🔧 Como Usar

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 3. Build de produção

```bash
npm run build
npm start
```

## 🎮 Fluxo de Uso

### Etapa 2: Diagnóstico Duplo (/)

O médico ajusta 6 sliders que impactam o faturamento:

1. **Mix Particular/Convênio** - Percentual de consultas particulares
2. **Conversão da Recepção** - Taxa de ligações que viram consulta
3. **Dias Úteis no Mês** - Quantos dias atende
4. **Consultas por Dia** - Meta diária de atendimentos
5. **Ticket Particular** - Valor médio da consulta particular
6. **Ticket Convênio** - Valor médio do convênio

**Resultado em tempo real:**
- Faturamento mensal projetado
- Número de consultas
- Ticket médio
- Ligações necessárias
- ROI anualizado

### Etapa 3: Resultado que Dói (/resultado)

Mostra:
- **Gap anualizado** - Quanto está deixando na mesa
- **Comparativo** entre cenário atual e otimizado
- **Insights personalizados** - Qual alavanca tem mais impacto
- **CTA contextual:**
  - **Standalone:** "Agende diagnóstico gratuito"
  - **Order Bump (Protocolo):** "Quero atacar a captação também"

## 🧮 Fórmulas de Cálculo

### Consultas Mensais
```typescript
consultasMes = diasUteisMes × consultasPorDia
```

### Faturamento Mensal
```typescript
consultasParticular = consultasMes × mixParticular
consultasConvenio = consultasMes × (1 - mixParticular)
faturamento = (consultasParticular × ticketParticular) + (consultasConvenio × ticketConvenio)
```

### Gap Anualizado
```typescript
gapMensal = faturamentoOtimizado - faturamentoAtual
gapAnual = gapMensal × 12
```

### Ligações Necessárias
```typescript
ligacoes = Math.ceil(consultasMes / conversaoRecepcao)
```

## 🎯 Próximos Passos (Fase 2)

- [ ] Integração com GoHighLevel (captura de leads)
- [ ] Query params para contexto (`?contexto=order_bump`)
- [ ] Comparativo com benchmark de mercado
- [ ] Exportar PDF do diagnóstico
- [ ] Salvar cenários (localStorage)
- [ ] Analytics (PostHog/Vercel Analytics)
- [ ] Modo dark
- [ ] Responsividade mobile otimizada

## 📊 Métricas Rastreadas (Futuro)

```javascript
{
  faturamento_atual: number,
  faturamento_otimizado: number,
  gap_anual: number,
  mix_atual: number,
  conversao_atual: number,
  origem: "standalone" | "order_bump_protocolo",
  especialidade: string
}
```

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Outras opções
- Netlify
- Railway
- Docker

## 📝 Notas de Desenvolvimento

- **Tailwind CSS v4** usa sintaxe CSS-first com `@theme inline`
- **Zustand** é mais leve que Redux para este caso de uso
- **Framer Motion** adiciona 30kb mas melhora significativamente a UX
- **Sliders customizados** para manter identidade visual MedGM

## 📄 Licença

Projeto proprietário da MedGM.

---

**Desenvolvido com ❤️ para médicos que querem crescer de forma estruturada**
