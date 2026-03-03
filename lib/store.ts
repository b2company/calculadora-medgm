import { create } from 'zustand';

interface CalculadoraState {
  // Inputs base (fixos por enquanto, podem vir de um form depois)
  diasPorSemana: number;
  consultasPorDia: number;
  ticketParticular: number;
  ticketConvenio: number;

  // Sliders ajustáveis
  mixParticular: number; // 0 a 1 (0.35 = 35%)
  conversaoRecepcao: number; // 0 a 1 (0.4 = 40%)
  diasUteisMes: number;
  consultasPorDiaAjustado: number;

  // Actions
  setMixParticular: (value: number) => void;
  setConversaoRecepcao: (value: number) => void;
  setDiasUteisMes: (value: number) => void;
  setConsultasPorDiaAjustado: (value: number) => void;
  setTicketParticular: (value: number) => void;
  setTicketConvenio: (value: number) => void;
}

export const useCalculadoraStore = create<CalculadoraState>((set) => ({
  // Valores iniciais
  diasPorSemana: 5,
  consultasPorDia: 8,
  ticketParticular: 500,
  ticketConvenio: 180,
  mixParticular: 0.35, // 35% particular
  conversaoRecepcao: 0.40, // 40% conversão
  diasUteisMes: 22,
  consultasPorDiaAjustado: 8,

  // Actions
  setMixParticular: (value) => set({ mixParticular: value }),
  setConversaoRecepcao: (value) => set({ conversaoRecepcao: value }),
  setDiasUteisMes: (value) => set({ diasUteisMes: value }),
  setConsultasPorDiaAjustado: (value) => set({ consultasPorDiaAjustado: value }),
  setTicketParticular: (value) => set({ ticketParticular: value }),
  setTicketConvenio: (value) => set({ ticketConvenio: value }),
}));

// Funções de cálculo
export const calcularMetricas = (state: CalculadoraState) => {
  const consultasMes = state.diasUteisMes * state.consultasPorDiaAjustado;

  const consultasParticular = Math.round(consultasMes * state.mixParticular);
  const consultasConvenio = Math.round(consultasMes * (1 - state.mixParticular));

  const faturamentoAtual = (consultasParticular * state.ticketParticular) + (consultasConvenio * state.ticketConvenio);

  const ticketMedio = (consultasParticular * state.ticketParticular + consultasConvenio * state.ticketConvenio) / consultasMes;

  // Leads necessários para atingir esse número de consultas com a conversão atual
  // Ex: Se precisa de 100 consultas e conversão é 50%, precisa de 200 leads
  const ligacoesNecessarias = Math.ceil(consultasMes / state.conversaoRecepcao);

  // Custo por consulta (hipotético, pode ajustar depois)
  const custoPorConsulta = 87.50;

  // ROI anualizado
  const faturamentoAnual = faturamentoAtual * 12;
  const custoAnual = consultasMes * custoPorConsulta * 12;
  const roi = faturamentoAnual / custoAnual;

  return {
    consultasMes,
    consultasParticular,
    consultasConvenio,
    faturamentoAtual,
    ticketMedio,
    ligacoesNecessarias,
    custoPorConsulta,
    roi,
  };
};

// Calcula o gap entre cenário atual e otimizado
export const calcularGap = (atual: CalculadoraState, otimizado: Partial<CalculadoraState>) => {
  const metricsAtual = calcularMetricas(atual);
  const metricsOtimizado = calcularMetricas({ ...atual, ...otimizado });

  const gapMensal = metricsOtimizado.faturamentoAtual - metricsAtual.faturamentoAtual;
  const gapAnual = gapMensal * 12;
  const gapPercentual = (gapMensal / metricsAtual.faturamentoAtual) * 100;

  return {
    metricsAtual,
    metricsOtimizado,
    gapMensal,
    gapAnual,
    gapPercentual,
  };
};
