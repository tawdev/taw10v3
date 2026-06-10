'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/admin-auth';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@taw10.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      router.replace('/dashboard');
    } catch (error) {
      const message = error instanceof Error && error.message === 'API_UNAVAILABLE'
        ? "Impossible de joindre l'API. Verifiez que le backend est lance et que NEXT_PUBLIC_API_URL est correct."
        : 'Email ou mot de passe invalide.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-[#dab055] blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-[#1f2a24] blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 mx-auto flex w-[90%] max-w-[1000px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111111]/60 shadow-2xl backdrop-blur-2xl lg:flex-row"
      >
        {/* Left Side: Branding */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#1f2a24]/80 to-[#0a0f0c]/80 p-10 text-white lg:w-1/2 lg:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(218,176,85,0.15),transparent_50%)]" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#dab055] to-[#a68942] text-xl font-black text-[#1f2a24] shadow-lg"
            >
              T10
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="mt-8 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#dab055]">Portail Exclusif</p>
              <h1 className="mt-4 text-4xl font-light leading-tight tracking-wide md:text-5xl">
                Espace <br/><span className="font-semibold text-[#dab055]">Administrateur</span>
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
                Gérez l'ensemble des services, clients et publications TAW10 depuis une interface sécurisée et centralisée.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="relative z-10 mt-12 grid gap-4 text-sm text-white/80 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-md transition hover:bg-white/10">
              <span className="material-symbols-outlined text-[24px] text-[#dab055]">shield_lock</span>
              <span className="font-medium">Chiffrement AES</span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-md transition hover:bg-white/10">
              <span className="material-symbols-outlined text-[24px] text-[#dab055]">verified_user</span>
              <span className="font-medium">Accès Restreint</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center bg-white/5 p-8 lg:w-1/2 lg:p-14">
          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSubmit} 
            className="mx-auto w-full max-w-sm"
          >
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-white">Connexion</h2>
              <p className="mt-2 text-sm text-white/50">Veuillez vous identifier pour continuer.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60" htmlFor="email">
                  Adresse Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30">mail</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder-white/20 outline-none backdrop-blur-sm transition focus:border-[#dab055] focus:bg-white/10 focus:ring-1 focus:ring-[#dab055]"
                    placeholder="admin@taw10.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60" htmlFor="password">
                  Mot de Passe
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30">lock</span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder-white/20 outline-none backdrop-blur-sm transition focus:border-[#dab055] focus:bg-white/10 focus:ring-1 focus:ring-[#dab055]"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                <span className="material-symbols-outlined text-[20px] text-red-400">error</span>
                <p className="leading-tight">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#dab055] to-[#a68942] font-semibold tracking-wide text-[#1f2a24] shadow-[0_0_20px_rgba(218,176,85,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(218,176,85,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              )}
              {isLoading ? 'Authentification...' : 'Accéder au tableau de bord'}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
