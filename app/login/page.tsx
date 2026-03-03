'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      // Login bem-sucedido, redireciona
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-clean via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-gray to-gray-900 text-white px-8 py-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-medgm.png"
                alt="MedGM"
                width={150}
                height={35}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold text-center">Acesso à Calculadora</h1>
            <p className="text-sm text-gray-300 text-center mt-2">
              Use o mesmo email cadastrado na compra
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Seu email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
                  placeholder="seu@email.com"
                  autoFocus
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-gold to-[#C5A87E] text-black font-semibold py-3 px-6 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Entrando...</span>
              ) : (
                <>
                  <span>Acessar Calculadora</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Precisa de ajuda?{' '}
              <a href="mailto:contato@medgm.com.br" className="text-gold hover:underline">
                Entre em contato
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-clean via-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gold text-lg">Carregando...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
