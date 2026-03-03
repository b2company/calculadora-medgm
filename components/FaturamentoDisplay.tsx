'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

interface FaturamentoDisplayProps {
  faturamentoAtual: number;
  consultasMes: number;
  ticketMedio: number;
  ligacoesNecessarias: number;
  custoPorConsulta: number;
  roi: number;
  mixParticular: number;
  faturamentoInicial?: number;
}

function AnimatedNumber({ value, format }: { value: number; format?: (n: number) => string }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (latest) => {
    return format ? format(Math.round(latest)) : Math.round(latest).toString();
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function FaturamentoDisplay({
  faturamentoAtual,
  consultasMes,
  ticketMedio,
  ligacoesNecessarias,
  custoPorConsulta,
  roi,
  mixParticular,
  faturamentoInicial,
}: FaturamentoDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const mudou = faturamentoInicial && faturamentoAtual !== faturamentoInicial;
  const diferenca = faturamentoInicial ? faturamentoAtual - faturamentoInicial : 0;
  const percentualMudanca = faturamentoInicial
    ? ((diferenca / faturamentoInicial) * 100)
    : 0;

  return (
    <div className="bg-dark-gray rounded-2xl p-8 text-white shadow-2xl h-full flex flex-col">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          Faturamento Mensal Estimado
        </p>
        <h2 className="text-5xl font-bold text-white">
          <AnimatedNumber value={faturamentoAtual} format={formatCurrency} />
        </h2>

        {mudou && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 mt-3 ${
              diferenca > 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-lg font-semibold">
              {formatCurrency(Math.abs(diferenca))} ({percentualMudanca.toFixed(1)}%)
            </span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">CONSULTAS</p>
          <p className="text-2xl font-bold">
            <AnimatedNumber value={consultasMes} />
          </p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">TICKET MÉDIO</p>
          <p className="text-2xl font-bold">
            <AnimatedNumber value={ticketMedio} format={formatCurrency} />
          </p>
        </div>
      </div>

      {mudou && diferenca > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gold mb-1">
                Com as mudanças:
              </p>
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={faturamentoAtual} format={formatCurrency} />
              </p>
              <p className="text-xs text-gray-300 mt-1">
                +<AnimatedNumber value={diferenca} format={formatCurrency} /> (+<AnimatedNumber value={percentualMudanca} format={(n) => n.toFixed(1)} />%)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-auto space-y-3 pt-6 border-t border-gray-700">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          Métricas Derivadas
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Leads necessários/mês</span>
          <span className="text-lg font-semibold">
            <AnimatedNumber value={ligacoesNecessarias} />
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Custo por consulta</span>
          <span className="text-lg font-semibold">
            <AnimatedNumber value={custoPorConsulta} format={formatCurrency} />
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">ROI anualizado</span>
          <span className="text-lg font-semibold text-gold">
            <AnimatedNumber value={roi} format={(n) => `${n.toFixed(1)}x`} />
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
          <span className="text-sm text-gray-300">Mix particular atual</span>
          <span className="text-lg font-semibold text-gold">
            <AnimatedNumber value={mixParticular * 100} format={(n) => `${Math.round(n)}%`} />
          </span>
        </div>
      </div>
    </div>
  );
}
