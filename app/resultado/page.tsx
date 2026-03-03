'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCalculadoraStore, calcularMetricas } from '@/lib/store';
import FormularioModal from '@/components/FormularioModal';
import { trackResultViewed, trackFormOpened, trackCTAClicked } from '@/lib/tracking';

export default function ResultadoPage() {
  const state = useCalculadoraStore();
  const [contexto] = useState<'standalone' | 'order_bump'>('standalone'); // Pode vir de query param
  const [modalOpen, setModalOpen] = useState(false);

  const metrics = calcularMetricas(state);

  // Cenário otimizado (exemplo: 60% particular, 70% conversão)
  const cenarioOtimizado = {
    ...state,
    mixParticular: 0.60,
    conversaoRecepcao: 0.70,
  };

  const metricsOtimizado = calcularMetricas(cenarioOtimizado);

  const gapMensal = metricsOtimizado.faturamentoAtual - metrics.faturamentoAtual;
  const gapAnual = gapMensal * 12;
  const gapPercentual = (gapMensal / metrics.faturamentoAtual) * 100;

  // Track ViewContent quando a página de resultado é visualizada
  useEffect(() => {
    trackResultViewed({
      faturamentoAtual: metrics.faturamentoAtual,
      faturamentoOtimizado: metricsOtimizado.faturamentoAtual,
      gapAnual: gapAnual,
    });
  }, [metrics.faturamentoAtual, metricsOtimizado.faturamentoAtual, gapAnual]);

  // Determina qual é a alavanca mais impactante
  const impactoMix = Math.abs(
    calcularMetricas({ ...state, mixParticular: 0.60 }).faturamentoAtual -
      metrics.faturamentoAtual
  );

  const impactoConversao = Math.abs(
    calcularMetricas({ ...state, conversaoRecepcao: 0.70 }).faturamentoAtual -
      metrics.faturamentoAtual
  );

  let mensagemPrioridade = '';
  let mensagemSecundaria = '';

  if (impactoMix > impactoConversao * 1.3) {
    mensagemPrioridade = 'Sua maior oportunidade está na captação de pacientes particulares';
    mensagemSecundaria = 'Segunda prioridade: treinar sua recepção para converter mais leads';
  } else if (impactoConversao > impactoMix * 1.3) {
    mensagemPrioridade = 'Sua recepção está perdendo pacientes que já querem agendar';
    mensagemSecundaria = 'Segunda prioridade: aumentar a captação de pacientes particulares';
  } else {
    mensagemPrioridade = 'Você precisa captar mais E converter melhor na recepção';
    mensagemSecundaria = 'Atacar os dois lados simultaneamente gera impacto exponencial';
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Função para abrir o modal com tracking
  const handleOpenModal = () => {
    trackCTAClicked(contexto === 'standalone' ? 'agendar_diagnostico' : 'atacar_captacao');
    trackFormOpened(contexto);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-gray via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos sliders</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Headline */}
          <div className="text-center space-y-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gold uppercase tracking-widest text-sm font-semibold"
            >
              Análise Completa
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold"
            >
              Você está deixando na mesa
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="inline-block"
            >
              <div className="bg-gradient-to-r from-gold to-[#C5A87E] text-black px-8 py-6 rounded-2xl shadow-2xl">
                <p className="text-6xl md:text-7xl font-bold">
                  {formatCurrency(gapAnual)}
                </p>
                <p className="text-xl mt-2 font-medium">por ano</p>
              </div>
            </motion.div>
          </div>

          {/* Comparison Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                Faturamento Atual
              </p>
              <p className="text-3xl font-bold">{formatCurrency(metrics.faturamentoAtual)}</p>
              <p className="text-sm text-gray-400 mt-1">baseado no seu cenário atual</p>
            </div>

            <div className="bg-gold/10 backdrop-blur rounded-xl p-6 border border-gold/30">
              <p className="text-xs uppercase tracking-wide text-gold mb-2">
                Faturamento Otimizado
              </p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(metricsOtimizado.faturamentoAtual)}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                com 60% particular e 70% conversão
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold/20 to-gold/5 backdrop-blur rounded-xl p-6 border border-gold">
              <p className="text-xs uppercase tracking-wide text-gold mb-2">
                Gap Mensal
              </p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(gapMensal)}
              </p>
              <p className="text-sm text-green-400 mt-1 font-semibold">
                +{gapPercentual.toFixed(1)}% de crescimento
              </p>
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-800/30 backdrop-blur rounded-2xl p-8 border border-gray-700"
          >
            <div className="flex items-start gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-2">{mensagemPrioridade}</h3>
                <p className="text-gray-400">{mensagemSecundaria}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Meta de Mix</p>
                  <p className="text-sm text-gray-400">
                    De {(state.mixParticular * 100).toFixed(0)}% para 60% de
                    pacientes particulares
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Meta de Conversão</p>
                  <p className="text-sm text-gray-400">
                    De {(state.conversaoRecepcao * 100).toFixed(0)}% para 70% de
                    leads convertidos
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-gold via-[#D6B991] to-[#C5A87E] text-black rounded-2xl p-10 text-center shadow-2xl"
          >
            {contexto === 'standalone' ? (
              <>
                <h3 className="text-3xl font-bold mb-4">
                  Quer um plano personalizado para fechar esse gap?
                </h3>
                <p className="text-lg mb-8 text-gray-900">
                  Agende seu diagnóstico gratuito com a MedGM e descubra exatamente
                  como captar mais pacientes particulares e treinar sua recepção.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  Agendar Diagnóstico Gratuito
                </button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold mb-4">
                  Você já tem o Protocolo para melhorar a conversão
                </h3>
                <p className="text-lg mb-8 text-gray-900">
                  Agora acompanhe o impacto financeiro mês a mês. Quer atacar a outra
                  alavanca também? Veja como a MedGM acelera a captação particular.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <TrendingUp className="w-5 h-5" />
                  Quero Atacar a Captação Também
                </button>
              </>
            )}

            <p className="text-sm text-gray-700 mt-6">
              A maior assessoria de growth para médicos do Brasil • 250+ clínicas atendidas
            </p>
          </motion.div>

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center text-gray-500 text-sm"
          >
            <p>
              Cálculos baseados em {metrics.consultasMes} consultas/mês •{' '}
              {(state.mixParticular * 100).toFixed(0)}% particular •{' '}
              {(state.conversaoRecepcao * 100).toFixed(0)}% conversão
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Modal de Formulário */}
      <FormularioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contexto={contexto}
      />
    </div>
  );
}
