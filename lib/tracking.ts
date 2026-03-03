// Funções de tracking para Meta Pixel e GTM

declare global {
  interface Window {
    fbq: any;
    dataLayer: any[];
  }
}

// Meta Pixel Events
export const trackMetaEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

export const trackMetaCustomEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data);
  }
};

// Google Tag Manager Events
export const trackGTMEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...data,
    });
  }
};

// Eventos específicos da calculadora
export const trackSliderChange = (sliderName: string, value: number) => {
  trackGTMEvent('slider_changed', {
    slider_name: sliderName,
    slider_value: value,
  });
};

export const trackResultViewed = (data: {
  faturamentoAtual: number;
  faturamentoOtimizado: number;
  gapAnual: number;
}) => {
  // Meta Pixel - ViewContent
  trackMetaEvent('ViewContent', {
    content_name: 'Resultado da Calculadora',
    value: data.gapAnual,
    currency: 'BRL',
  });

  // GTM
  trackGTMEvent('view_result', {
    faturamento_atual: data.faturamentoAtual,
    faturamento_otimizado: data.faturamentoOtimizado,
    gap_anual: data.gapAnual,
  });
};

export const trackFormOpened = (contexto: string) => {
  // Meta Pixel - Lead (interesse em contato)
  trackMetaEvent('Lead', {
    content_name: 'Formulário de Agendamento',
    content_category: contexto,
  });

  // GTM
  trackGTMEvent('form_opened', {
    form_type: 'agendamento',
    contexto: contexto,
  });
};

export const trackFormSubmitted = (contexto: string) => {
  // Meta Pixel - CompleteRegistration
  trackMetaEvent('CompleteRegistration', {
    content_name: 'Diagnóstico Agendado',
    content_category: contexto,
  });

  // GTM
  trackGTMEvent('form_submitted', {
    form_type: 'agendamento',
    contexto: contexto,
  });
};

export const trackCalculatorStarted = () => {
  trackMetaCustomEvent('CalculatorStarted');
  trackGTMEvent('calculator_started');
};

export const trackCTAClicked = (ctaType: string) => {
  trackGTMEvent('cta_clicked', {
    cta_type: ctaType,
  });
};
