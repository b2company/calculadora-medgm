'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { trackFormSubmitted } from '@/lib/tracking';

interface FormularioModalProps {
  isOpen: boolean;
  onClose: () => void;
  contexto?: string;
}

export default function FormularioModal({ isOpen, onClose, contexto = 'standalone' }: FormularioModalProps) {
  // Adiciona o script do form_embed quando o modal abre
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://admin.medgm.com.br/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup: remove o script quando o modal fecha
        const existingScript = document.querySelector('script[src="https://admin.medgm.com.br/js/form_embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [isOpen]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fecha modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Listener para detectar submissão do formulário via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verifica se a mensagem vem do domínio correto
      if (event.origin !== 'https://admin.medgm.com.br') return;

      // Se o formulário foi enviado com sucesso
      if (event.data.type === 'form_submitted' || event.data === 'form_submitted') {
        trackFormSubmitted(contexto);
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleMessage);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, contexto]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-dark-gray to-gray-900 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Agende seu Diagnóstico Gratuito</h2>
                  <p className="text-sm text-gray-300 mt-1">
                    Preencha o formulário e nossa equipe entrará em contato
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulário (iframe) */}
              <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
                <iframe
                  src="https://admin.medgm.com.br/widget/survey/3Y2QhCiV8gLjezX3CMbd"
                  style={{ border: 'none', width: '100%', minHeight: '500px' }}
                  scrolling="no"
                  id="3Y2QhCiV8gLjezX3CMbd"
                  title="Formulário de Agendamento MedGM"
                />
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Seus dados estão seguros e serão usados apenas para contato comercial
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
