'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  FileUp,
  Plus,
  RefreshCw,
  ShoppingCart,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin-store';
import { ordersService } from '@/services/orders.service';
import { contactsService } from '@/services/contacts.service';
import { customersService } from '@/services/customers.service';
import { documentsService } from '@/services/documents.service';
import { pricingService } from '@/services/pricing.service';
import { Order } from '@/types/admin';

const currency = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-amber-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-violet-500', 'bg-rose-500', 'bg-cyan-500',
  'bg-orange-500', 'bg-pink-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ──────────────────────────────── SVG Line Chart ────────────────────────────
function RevenueChart({ orders, getOrderPrice }: { orders: Order[]; getOrderPrice: (o: Order) => number }) {
  const W = 540, H = 220, PAD_L = 50, PAD_B = 36, PAD_T = 20, PAD_R = 16;

  const chartData = useMemo(() => {
    const now = new Date();
    const months: { label: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        revenue: 0,
      });
    }

    // Fill with real data from completed orders
    orders.filter((o) => o.status === 'COMPLETED').forEach((o) => {
      const d = new Date(o.createdAt);
      const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
      if (monthsAgo >= 0 && monthsAgo < 6) {
        months[5 - monthsAgo].revenue += getOrderPrice(o);
      }
    });

    // If no real data, show demo wave
    if (months.every((m) => m.revenue === 0)) {
      const demo = [2200, 4800, 6400, 3800, 7200, 5600];
      months.forEach((m, i) => { m.revenue = demo[i]; });
    }
    return months;
  }, [orders, getOrderPrice]);

  const maxVal = Math.max(...chartData.map((d) => d.revenue), 1);
  const cW = W - PAD_L - PAD_R;
  const cH = H - PAD_B - PAD_T;

  const pts = chartData.map((d, i) => ({
    x: PAD_L + (i / (chartData.length - 1)) * cW,
    y: PAD_T + cH - (d.revenue / maxVal) * cH,
    d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${PAD_T + cH} L${PAD_L},${PAD_T + cH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    val: Math.round(maxVal * t),
    y: PAD_T + cH - t * cH,
  }));

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dab055" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#dab055" stopOpacity="0.01" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Y grid lines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={PAD_L - 8} y={t.y + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)">
            {t.val >= 1000 ? `${Math.round(t.val / 1000)}K` : t.val}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#dab055" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />

      {/* X axis labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)">{p.d.label}</text>
      ))}

      {/* Interactive dots */}
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
          <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 4} fill={hovered === i ? '#fff' : '#dab055'} stroke="#dab055" strokeWidth="2" />
          {hovered === i && (
            <g>
              <rect x={p.x - 46} y={p.y - 38} width="92" height="28" rx="6" fill="#1a1a0f" stroke="#dab055" strokeWidth="1" />
              <text x={p.x} y={p.y - 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="#dab055">
                {currency.format(p.d.revenue)}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// ──────────────────────────────── SVG Donut Chart ───────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 70, r = 44, CX = 90, CY = 90;
  let startAngle = -Math.PI / 2;

  const slices = data.map((d) => {
    const angle = total > 0 ? (d.value / total) * 2 * Math.PI : 0;
    const end = startAngle + angle;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(end);
    const y2 = CY + R * Math.sin(end);
    const ix1 = CX + r * Math.cos(startAngle);
    const iy1 = CY + r * Math.sin(startAngle);
    const ix2 = CX + r * Math.cos(end);
    const iy2 = CY + r * Math.sin(end);
    const large = angle > Math.PI ? 1 : 0;
    const path = angle < 0.01 ? '' :
      `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${r},${r} 0 ${large} 0 ${ix1},${iy1} Z`;
    startAngle = end;
    return { ...d, path, pct: total > 0 ? Math.round((d.value / total) * 100) : 0 };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} className="transition-opacity hover:opacity-80" />
          ))}
          <circle cx={CX} cy={CY} r={r - 3} fill="#0d0d0d" />
          <text x={CX} y={CY - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="white">{total}</text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)">Total</text>
        </svg>
      </div>
      <div className="grid gap-2.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="text-sm text-white/80">{s.label}</span>
            <span className="ml-auto text-sm font-bold text-white">{s.value} <span className="text-xs font-normal text-white/40">({s.pct}%)</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────── Quick Action Card ─────────────────────────
function QuickAction({ icon: Icon, label, desc, href }: { icon: React.ElementType; label: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[#dab055]/40 hover:bg-[#dab055]/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#dab055] transition-all group-hover:bg-[#dab055] group-hover:text-[#050505]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-white/50 truncate">{desc}</p>
      </div>
    </Link>
  );
}

// ──────────────────────────────── Main Component ────────────────────────────
export function DashboardHome() {
  const {
    orders, pricing, customers, documents, contacts,
    setOrders, setPricing, setCustomers, setDocuments, setContacts,
  } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const getOrderPrice = useCallback((order: Order) => {
    if (typeof order.revenue === 'number' && order.revenue > 0) return order.revenue;
    const selectedPlan = order.selectedPlan?.trim().toLowerCase();
    if (!selectedPlan) return 0;
    const plan = pricing.find((item) => {
      const planName = item.name.trim().toLowerCase();
      return selectedPlan === planName || selectedPlan.includes(planName) || planName.includes(selectedPlan);
    });
    return plan?.price ?? 0;
  }, [pricing]);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    const results = await Promise.allSettled([
      ordersService.list(), pricingService.list(true), customersService.list(),
      documentsService.list(), contactsService.list(),
    ]);
    const [ordersRes, pricingRes, customersRes, documentsRes, contactsRes] = results;
    if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value);
    if (pricingRes.status === 'fulfilled') setPricing(pricingRes.value);
    if (customersRes.status === 'fulfilled') setCustomers(customersRes.value);
    if (documentsRes.status === 'fulfilled') setDocuments(documentsRes.value);
    if (contactsRes.status === 'fulfilled') setContacts(contactsRes.value);
    setLastSync(new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }));
    setIsLoading(false);
  }, [setContacts, setCustomers, setDocuments, setOrders, setPricing]);

  useEffect(() => { refreshDashboard(); }, [refreshDashboard]);

  const metrics = useMemo(() => {
    const completed = orders.filter((o) => o.status === 'COMPLETED');
    const pending = orders.filter((o) => ['PENDING', 'WAITING_DOCUMENTS'].includes(o.status));
    const inProgress = orders.filter((o) => o.status === 'IN_PROGRESS');
    const cancelled = orders.filter((o) => o.status === 'CANCELLED');
    const revenue = completed.reduce((s, o) => s + getOrderPrice(o), 0);
    return { completed, pending, inProgress, cancelled, revenue };
  }, [getOrderPrice, orders]);

  const kpis = [
    { label: 'Total Commandes', value: orders.length, detail: `${orders.length > 0 ? Math.round((metrics.completed.length / orders.length) * 100) : 0}% terminées`, icon: ShoppingCart, href: '/dashboard/orders', color: 'text-amber-400' },
    { label: 'Total Clients', value: customers.length, detail: 'Profils enregistrés', icon: Users, href: '/dashboard/customers', color: 'text-blue-400' },
    { label: 'En attente', value: metrics.pending.length, detail: 'Besoin de suivi', icon: Clock3, href: '/dashboard/orders', color: 'text-orange-400' },
    { label: 'Terminées', value: metrics.completed.length, detail: 'Revenus comptabilisés', icon: CheckCircle2, href: '/dashboard/orders', color: 'text-emerald-400' },
    { label: 'Documents', value: documents.length, detail: 'Tous les clients', icon: FileUp, href: '/dashboard/documents', color: 'text-violet-400' },
    { label: 'Revenus', value: currency.format(metrics.revenue), detail: 'Commandes terminées', icon: Banknote, href: '/dashboard/orders', color: 'text-[#dab055]' },
  ];

  // Recent activity feed (derived from recent orders + contacts)
  const activityFeed = useMemo(() => {
    const items: { type: string; title: string; sub: string; time: string; icon: React.ElementType; iconBg: string }[] = [];
    orders.slice(0, 2).forEach((o) => {
      items.push({
        type: 'order',
        title: 'Nouvelle commande reçue',
        sub: o.orderNumber,
        time: formatDate(o.createdAt),
        icon: ShoppingCart,
        iconBg: 'bg-amber-500/20 text-amber-400',
      });
    });
    contacts.slice(0, 2).forEach((c) => {
      items.push({
        type: 'contact',
        title: 'Nouveau contact',
        sub: c.name,
        time: formatDate(c.createdAt),
        icon: UserPlus,
        iconBg: 'bg-blue-500/20 text-blue-400',
      });
    });
    documents.slice(0, 1).forEach((d) => {
      items.push({
        type: 'doc',
        title: 'Document téléchargé',
        sub: d.name,
        time: d.uploadedAt,
        icon: FileText,
        iconBg: 'bg-violet-500/20 text-violet-400',
      });
    });
    return items.slice(0, 5);
  }, [orders, contacts, documents]);

  const donutData = [
    { label: 'En attente', value: metrics.pending.length, color: '#dab055' },
    { label: 'En cours', value: metrics.inProgress.length, color: '#8b6a1f' },
    { label: 'Terminées', value: metrics.completed.length, color: '#c49b42' },
    { label: 'Annulées', value: metrics.cancelled.length, color: '#ef4444' },
  ];

  const statusLabel: Record<string, { label: string; cls: string }> = {
    PENDING: { label: 'EN ATTENTE', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    IN_PROGRESS: { label: 'EN COURS', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    WAITING_DOCUMENTS: { label: 'EN ATTENTE DOCS', cls: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
    COMPLETED: { label: 'TERMINÉE', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    CANCELLED: { label: 'ANNULÉE', cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 bg-white/5" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="h-64 bg-white/5 xl:col-span-2" />
          <Skeleton className="h-64 bg-white/5" />
          <Skeleton className="h-64 bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link key={kpi.label} href={kpi.href}>
              <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dab055]/30">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-white/40">{kpi.label}</p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-white">{kpi.value}</p>
                      <p className="mt-0.5 text-xs text-white/50">{kpi.detail}</p>
                    </div>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 ${kpi.color} transition-all group-hover:scale-110`}>
                      <Icon className="h-4.5 w-4.5 h-5 w-5" />
                    </div>
                  </div>
                  {/* mini sparkline bar */}
                  <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-[#dab055]/60" style={{ width: `${Math.min(100, (Number(typeof kpi.value === 'number' ? kpi.value : 0) / Math.max(orders.length, 1)) * 100)}%` }} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr_1fr]">
        {/* Revenue Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Aperçu des revenus</CardTitle>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={refreshDashboard} disabled={isLoading} className="h-7 px-3 text-xs">
                <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                {lastSync ? `${lastSync}` : 'Sync'}
              </Button>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">Ce mois-ci ▾</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <RevenueChart orders={orders} getOrderPrice={getOrderPrice} />
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Commandes par statut</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <DonutChart data={donutData} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Activité récente</CardTitle>
            <Link href="/dashboard/orders" className="text-xs font-bold text-[#dab055] hover:text-[#e8c979]">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-2">
            {activityFeed.length === 0 ? (
              <p className="py-4 text-center text-xs text-white/40">Aucune activité récente</p>
            ) : activityFeed.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-white/5">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                    <p className="truncate text-xs text-white/50">{item.sub}</p>
                  </div>
                  <span className="shrink-0 text-xs text-white/30">{item.time}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent Orders Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Commandes récentes</CardTitle>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#dab055] hover:text-[#e8c979]">
              Voir toutes les commandes <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">ID Commande</th>
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">Client</th>
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">Plan</th>
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">Montant</th>
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">Statut</th>
                    <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-[#dab055]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const st = statusLabel[order.status] ?? { label: order.status, cls: 'bg-white/10 text-white/60 border-white/10' };
                    const price = getOrderPrice(order);
                    return (
                      <tr key={order.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                        <td className="px-5 py-3.5 text-xs font-bold text-white/70">{order.orderNumber}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${getAvatarColor(order.customerName)}`}>
                              {getInitials(order.customerName)}
                            </div>
                            <span className="text-sm font-semibold text-white">{order.customerName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold text-white/70">{order.selectedPlan || '—'}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-bold text-white">
                          {price ? currency.format(price) : <span className="text-white/30">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-white/40">{formatDate(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-white/30">Aucune commande trouvée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 p-4 pt-2 sm:grid-cols-3 xl:grid-cols-2">
            <QuickAction icon={Plus} label="Créer une commande" desc="Ajouter une nouvelle commande" href="/dashboard/orders" />
            <QuickAction icon={UserPlus} label="Ajouter un client" desc="Enregistrer un nouveau client" href="/dashboard/customers" />
            <QuickAction icon={FileUp} label="Téléverser un doc" desc="Ajouter un nouveau document" href="/dashboard/documents" />
            <QuickAction icon={Users} label="Voir les contacts" desc="Gérer vos contacts" href="/dashboard/contacts" />
            <QuickAction icon={Zap} label="Gérer les services" desc="Configurer les services" href="/dashboard/services" />
            <QuickAction icon={FileText} label="Générer un rapport" desc="Exporter les analyses" href="/dashboard/orders" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
