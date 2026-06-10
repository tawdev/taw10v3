'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/admin-auth';

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
    <section className="min-h-screen bg-[#f7f4ee] px-5 py-8 text-on-surface sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center">
        <div className="grid overflow-hidden rounded-lg border border-[#ded4c2] bg-white shadow-[0_24px_80px_rgba(28,28,27,0.10)] lg:grid-cols-[1fr_440px]">
          <div className="relative flex min-h-[360px] flex-col justify-between bg-[#1f2a24] p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(218,176,85,0.24),rgba(31,42,36,0)_55%)]" />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#dab055] text-lg font-black text-[#1f2a24]">
                T10
              </div>
              <p className="mt-8 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#e8c979]">TAW10 Admin</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">Portail administrateur</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#ede8dc]">
                Acces reserve aux administrateurs autorises. Les espaces publics restent separes du tableau de bord.
              </p>
            </div>
            <div className="relative mt-12 grid gap-3 text-sm text-[#ede8dc] sm:grid-cols-2">
              <div className="rounded-md border border-white/15 bg-white/5 p-4">
                <span className="material-symbols-outlined text-[20px] text-[#e8c979]">shield_lock</span>
                <p className="mt-2 font-semibold">JWT securise</p>
              </div>
              <div className="rounded-md border border-white/15 bg-white/5 p-4">
                <span className="material-symbols-outlined text-[20px] text-[#e8c979]">admin_panel_settings</span>
                <p className="mt-2 font-semibold">Acces admin uniquement</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mb-8">
              <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary">Connexion</p>
              <h2 className="mt-3 text-3xl font-semibold text-on-surface">Bienvenue</h2>
            </div>

            <label className="block text-sm font-semibold text-on-surface" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-outline-variant bg-[#fcfaf7] px-4 text-on-surface outline-none transition focus:border-primary focus:bg-white"
              autoComplete="email"
              required
            />

            <label className="mt-5 block text-sm font-semibold text-on-surface" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-outline-variant bg-[#fcfaf7] px-4 text-on-surface outline-none transition focus:border-primary focus:bg-white"
              autoComplete="current-password"
              required
            />

            {error ? (
              <p className="mt-4 rounded-md border border-[#f0b4ad] bg-[#fff2f0] px-4 py-3 text-sm font-medium leading-6 text-error">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-label text-sm font-bold uppercase text-white transition hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
