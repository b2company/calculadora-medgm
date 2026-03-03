'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import SliderCard from '@/components/SliderCard';
import FaturamentoDisplay from '@/components/FaturamentoDisplay';
import { useCalculadoraStore, calcularMetricas } from '@/lib/store';
import { trackCalculatorStarted } from '@/lib/tracking';

export default function Home() {
  const router = useRouter();
  const state = useCalculadoraStore();
  const [faturamentoInicial, setFaturamentoInicial] = useState<number | undefined>();

  const metrics = calcularMetricas(state);

  // Captura o faturamento inicial na primeira renderização
  useEffect(() => {
    if (faturamentoInicial === undefined) {
      setFaturamentoInicial(metrics.faturamentoAtual);
    }
  }, [faturamentoInicial, metrics.faturamentoAtual]);

  // Track quando a calculadora é iniciada
  useEffect(() => {
    trackCalculatorStarted();
  }, []);

  const handleVerResultado = () => {
    router.push('/resultado');
  };

  return (
    <div className="min-h-screen bg-clean">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Image
            src="/logo-medgm.png"
            alt="MedGM"
            width={180}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <p className="text-sm text-gray-500 mt-3 uppercase tracking-wide">
            Calculadora de Projeção de Faturamento
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">
              Diagnóstico de Faturamento
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Arraste os sliders abaixo e veja o impacto em tempo real no faturamento
              do seu consultório. Simule diferentes cenários e descubra seu potencial
              de crescimento.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Sliders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gold mb-6 font-semibold">
                    Alavancas de Crescimento
                  </h3>

                  <div className="space-y-8">
                    {/* Mix Particular/Convênio */}
                    <SliderCard
                      label="Mix Particular/Convênio"
                      sublabel="Percentual de consultas particulares vs convênio"
                      value={state.mixParticular * 100}
                      min={0}
                      max={100}
                      step={5}
                      onChange={(value) => state.setMixParticular(value / 100)}
                      format={(value) => `${value.toFixed(0)}%`}
                      unit="particular"
                    />

                    {/* Conversão da Recepção */}
                    <SliderCard
                      label="Conversão da Recepção"
                      sublabel="De cada 10 leads, quantos viram consulta agendada?"
                      value={state.conversaoRecepcao * 100}
                      min={10}
                      max={90}
                      step={5}
                      onChange={(value) => state.setConversaoRecepcao(value / 100)}
                      format={(value) => `${value.toFixed(0)}%`}
                    />

                    {/* Dias Úteis no Mês */}
                    <SliderCard
                      label="Dias Úteis no Mês"
                      sublabel="Quantos dias você atende por mês"
                      value={state.diasUteisMes}
                      min={15}
                      max={28}
                      step={1}
                      onChange={state.setDiasUteisMes}
                      unit="dias"
                    />

                    {/* Consultas por Dia */}
                    <SliderCard
                      label="Consultas por Dia (Meta)"
                      sublabel="Número de consultas que você quer fazer por dia"
                      value={state.consultasPorDiaAjustado}
                      min={4}
                      max={16}
                      step={1}
                      onChange={state.setConsultasPorDiaAjustado}
                      unit="consultas"
                    />

                    {/* Ticket Particular */}
                    <SliderCard
                      label="Ticket Particular"
                      sublabel="Valor médio da consulta particular"
                      value={state.ticketParticular}
                      min={200}
                      max={1500}
                      step={50}
                      onChange={state.setTicketParticular}
                      format={(value) => `R$ ${value.toFixed(0)}`}
                    />

                    {/* Ticket Convênio */}
                    <SliderCard
                      label="Ticket Convênio"
                      sublabel="Valor médio do convênio principal"
                      value={state.ticketConvenio}
                      min={80}
                      max={400}
                      step={10}
                      onChange={state.setTicketConvenio}
                      format={(value) => `R$ ${value.toFixed(0)}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Faturamento Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-8 h-fit"
            >
              <FaturamentoDisplay
                faturamentoAtual={metrics.faturamentoAtual}
                consultasMes={metrics.consultasMes}
                ticketMedio={metrics.ticketMedio}
                ligacoesNecessarias={metrics.ligacoesNecessarias}
                custoPorConsulta={metrics.custoPorConsulta}
                roi={metrics.roi}
                mixParticular={state.mixParticular}
                faturamentoInicial={faturamentoInicial}
              />
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <button
              onClick={handleVerResultado}
              className="group inline-flex items-center gap-3 bg-gold hover:bg-[#C5A87E] text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">Ver Análise Completa</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
