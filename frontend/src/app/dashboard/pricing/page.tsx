'use client';

import { FormEvent, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ActiveBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { Table, Td, Th } from '@/components/ui/table';
import { useAdminStore } from '@/store/admin-store';
import { useToastStore } from '@/store/toast-store';
import { PricingFeature, PricingPlan, PricingTheme } from '@/types/admin';
import { pricingService } from '@/services/pricing.service';
import { useEffect } from 'react';

const emptyFeature = (sortOrder: number): PricingFeature => ({
  id: crypto.randomUUID(),
  name_fr: '',
  name_ar: '',
  name_en: '',
  isIncluded: true,
  sortOrder,
});

const emptyPlan = (): PricingPlan => ({
  id: crypto.randomUUID(),
  name: '',
  price: 0,
  description: '',
  theme: 'DEFAULT',
  isPopular: false,
  isActive: true,
  sortOrder: 1,
  features: [emptyFeature(1)],
});

const sortFeatures = (features: PricingFeature[]) => [...features].sort((a, b) => a.sortOrder - b.sortOrder);
const normalizeFeatures = (features: PricingFeature[]) => sortFeatures(features).map((feature, index) => ({ ...feature, sortOrder: index + 1 }));

export default function PricingPage() {
  const { pricing, setPricing, upsertPlan, removePlan, togglePlan, movePlan } = useAdminStore();
  const toast = useToastStore((state) => state.toast);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pricingService.list(true)
      .then(plans => {
        if (plans && plans.length > 0) {
          // Replace fallback store data with actual remote plans
          setPricing(plans);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    if (editing.price < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (pricing.some((plan) => plan.id !== editing.id && plan.sortOrder === editing.sortOrder)) {
      setError('Duplicate plan sort orders are not allowed.');
      return;
    }
    if (editing.features.some((feature) => !feature.name_fr.trim() || !feature.name_ar.trim() || !feature.name_en.trim())) {
      setError('Feature names in all languages cannot be empty.');
      return;
    }

    try {
      // Strip forbidden properties from plan
      const { id, createdAt, updatedAt, ...cleanPayload } = editing as any;
      
      // Strip forbidden properties from features
      const cleanFeatures = normalizeFeatures(editing.features).map((feature: any) => {
        const { id, createdAt, updatedAt, planId, ...cleanFeature } = feature;
        return cleanFeature;
      });

      const payload = { ...cleanPayload, features: cleanFeatures };
      
      let savedPlan;
      const existingPlan = pricing.find(p => p.id === editing.id);
      
      // If it exists in the database (has createdAt), we update it. Otherwise create.
      if (existingPlan && (existingPlan as any).createdAt) {
        savedPlan = await pricingService.update(editing.id, payload);
      } else {
        savedPlan = await pricingService.create(payload);
      }

      upsertPlan(savedPlan);
      toast({ title: 'Pricing plan saved', description: 'Feature-by-feature configuration updated.', variant: 'success' });
      setEditing(null);
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save pricing plan.');
    }
  }

  function updateFeature(id: string, patch: Partial<PricingFeature>) {
    if (!editing) return;
    setEditing({
      ...editing,
      features: editing.features.map((feature) => feature.id === id ? { ...feature, ...patch } : feature),
    });
  }

  function moveFeature(id: string, direction: 'up' | 'down') {
    if (!editing) return;
    const features = normalizeFeatures(editing.features);
    const index = features.findIndex((feature) => feature.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= features.length) return;
    [features[index], features[target]] = [features[target], features[index]];
    setEditing({ ...editing, features: normalizeFeatures(features) });
  }

  return (
    <>
      <PageHeader
        title="Pricing Plans"
        description="Create plans that exactly match public pricing cards, including included/excluded features."
        actions={<Button onClick={() => setEditing({ ...emptyPlan(), sortOrder: pricing.length + 1 })}><Plus className="h-4 w-4" />Create Plan</Button>}
      />
      <Card className="rounded-3xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white/70 backdrop-blur-xl">
        <div className="bg-gradient-to-r from-[#1c1c1b] to-[#2a2a29] p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#dab055]">Manage Plans</h3>
            <p className="text-xs text-white/60 mt-1 font-medium">Overview of your current pricing tiers</p>
          </div>
        </div>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead className="bg-[#fcf9f6] border-b border-[#dab055]/10">
              <tr>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Plan</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Price</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Theme</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Popular</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Status</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Sort</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Features</Th>
                <Th className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b]/70 py-5">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#dab055]/5 transition-colors duration-300 border-b border-[#dab055]/10 last:border-0 group">
                  <Td className="py-5">
                    <p className="font-black text-[#1c1c1b] text-sm uppercase tracking-wider">{plan.name}</p>
                    <p className="text-xs text-[#1c1c1b]/60 mt-1 font-medium">{plan.description}</p>
                  </Td>
                  <Td className="font-black text-[#dab055] tracking-tight text-lg">{plan.price} <span className="text-xs tracking-widest text-[#1c1c1b]/50">MAD</span></Td>
                  <Td><Badge variant={plan.theme === 'DEFAULT' ? 'default' : plan.theme === 'FEATURED' ? 'warning' : 'success'} className="uppercase tracking-widest text-[9px] font-black">{plan.theme}</Badge></Td>
                  <Td>{plan.isPopular ? <Badge variant="success" className="uppercase tracking-widest text-[9px] font-black bg-[#dab055] text-white">Yes</Badge> : <Badge variant="muted" className="uppercase tracking-widest text-[9px] font-black">No</Badge>}</Td>
                  <Td><ActiveBadge active={plan.isActive} /></Td>
                  <Td className="font-black text-[#1c1c1b]/40">{plan.sortOrder}</Td>
                  <Td className="text-xs font-bold text-[#1c1c1b]/70">
                    <span className="text-[#dab055]">{plan.features.filter((feature) => feature.isIncluded).length}</span>
                    <span className="text-[#1c1c1b]/30 mx-1">/</span>
                    {plan.features.length} <span className="text-[10px] uppercase tracking-wider opacity-70 ml-1">inc.</span>
                  </Td>
                  <Td>
                    <div className="flex gap-2 items-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="flex bg-white rounded-lg shadow-sm border border-[#dab055]/20 overflow-hidden mr-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-none hover:bg-[#dab055] hover:text-white transition-colors" onClick={() => movePlan(plan.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                        <div className="w-[1px] bg-[#dab055]/20"></div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-none hover:bg-[#dab055] hover:text-white transition-colors" onClick={() => movePlan(plan.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-widest border-[#dab055]/30 hover:bg-[#dab055] hover:text-white hover:border-[#dab055] transition-all" onClick={() => setEditing({ ...plan, features: normalizeFeatures(plan.features) })}>Edit</Button>
                      <Button size="sm" variant="secondary" className={`h-8 text-xs font-bold uppercase tracking-widest transition-all ${plan.isActive ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-green-50 hover:text-green-600'}`} onClick={async () => {
                        try {
                          await pricingService.update(plan.id, { isActive: !plan.isActive });
                          togglePlan(plan.id);
                          toast({ title: 'Plan status updated', variant: 'success' });
                        } catch (err) {
                          toast({ title: 'Failed to update plan status', variant: 'destructive' });
                        }
                      }}>{plan.isActive ? 'Deactivate' : 'Activate'}</Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-white hover:bg-red-500 transition-colors rounded-lg" onClick={async () => {
                        if (confirm('Are you sure you want to delete this plan?')) {
                          try {
                            await pricingService.delete(plan.id);
                            removePlan(plan.id);
                            toast({ title: 'Plan deleted', variant: 'success' });
                          } catch (err) {
                            toast({ title: 'Failed to delete plan', variant: 'destructive' });
                          }
                        }
                      }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Dialog className="max-w-4xl" open={Boolean(editing)} title={<span className="text-[#dab055] font-black uppercase tracking-widest text-lg">Configure Plan</span>} onClose={() => { setEditing(null); setError(''); }}>
        {editing ? (
          <form onSubmit={save} className="grid gap-8 mt-4">
            <div className="grid gap-6 md:grid-cols-2 bg-[#fcf9f6] p-6 rounded-3xl border border-[#dab055]/20 shadow-inner">
              <Field label="Plan Name"><Input className="bg-white border-[#dab055]/30 focus:border-[#dab055] focus:ring-[#dab055]/20 font-bold" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></Field>
              <Field label="Price (MAD)"><Input type="number" min={0} className="bg-white border-[#dab055]/30 focus:border-[#dab055] focus:ring-[#dab055]/20 font-black text-[#dab055]" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} required /></Field>
              <Field label="Theme Visual"><Select className="bg-white border-[#dab055]/30 focus:border-[#dab055]" value={editing.theme} onChange={(event) => setEditing({ ...editing, theme: event.target.value as PricingTheme })}><option value="DEFAULT">DEFAULT (Light)</option><option value="FEATURED">FEATURED (Dark + Gold)</option><option value="PREMIUM">PREMIUM (Elite)</option></Select></Field>
              <Field label="Display Order"><Input type="number" min={1} className="bg-white border-[#dab055]/30 focus:border-[#dab055]" value={editing.sortOrder} onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })} required /></Field>
              <div className="md:col-span-2">
                <Field label="Short Description"><Textarea className="bg-white border-[#dab055]/30 focus:border-[#dab055] resize-none h-20" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} required /></Field>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-8 items-center pt-2 border-t border-[#dab055]/20 mt-2">
                <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#1c1c1b] cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${editing.isPopular ? 'bg-[#dab055] shadow-[0_0_15px_rgba(218,176,85,0.4)]' : 'bg-white border-2 border-[#1c1c1b]/20 group-hover:border-[#dab055]'}`}>
                    <input type="checkbox" className="hidden" checked={editing.isPopular} onChange={(event) => setEditing({ ...editing, isPopular: event.target.checked })} />
                    {editing.isPopular && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  Show Popular Badge
                </label>
                <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#1c1c1b] cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${editing.isActive ? 'bg-[#1c1c1b] shadow-lg' : 'bg-white border-2 border-[#1c1c1b]/20 group-hover:border-[#1c1c1b]'}`}>
                    <input type="checkbox" className="hidden" checked={editing.isActive} onChange={(event) => setEditing({ ...editing, isActive: event.target.checked })} />
                    {editing.isActive && <svg className="w-3 h-3 text-[#dab055]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  Plan is Active
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-[#dab055]/20 overflow-hidden bg-white shadow-xl shadow-[#dab055]/5">
              <div className="flex items-center justify-between border-b border-[#dab055]/20 bg-gradient-to-r from-[#1c1c1b] to-[#2a2a29] p-5">
                <div>
                  <p className="font-black text-[#dab055] uppercase tracking-widest text-sm">Features List</p>
                  <p className="text-[10px] text-white/60 mt-1 uppercase tracking-wider font-bold">Manage plan details shown on cards</p>
                </div>
                <Button type="button" size="sm" className="h-9 px-4 text-xs font-black uppercase tracking-widest bg-[#dab055] text-white hover:bg-[#c49b42] shadow-[0_4px_14px_0_rgba(218,176,85,0.39)] transition-all rounded-xl border-0" onClick={() => setEditing({ ...editing, features: [...editing.features, emptyFeature(editing.features.length + 1)] })}><Plus className="h-4 w-4 mr-1 stroke-[3]" />Add Feature</Button>
              </div>
              <div className="grid gap-4 p-5 bg-[#fcf9f6] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#dab055]/30 scrollbar-track-transparent">
                {sortFeatures(editing.features).map((feature) => (
                  <div key={feature.id} className="grid gap-5 rounded-2xl border-2 border-transparent bg-white p-5 shadow-sm md:grid-cols-[auto_1fr_auto_auto] md:items-start transition-all duration-300 hover:border-[#dab055]/40 hover:shadow-lg group relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#dab055] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl"></div>
                    <GripVertical className="h-5 w-5 text-[#1c1c1b]/20 cursor-grab active:cursor-grabbing mt-9 md:mt-11 group-hover:text-[#dab055] transition-colors" />
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 w-full">
                      <Field label="FR"><Input className="bg-[#fcf9f6] border-0 focus:ring-1 focus:ring-[#dab055] text-xs font-bold" placeholder="Nom de fonctionnalité" value={feature.name_fr} onChange={(event) => updateFeature(feature.id, { name_fr: event.target.value })} required /></Field>
                      <Field label="AR"><Input className="bg-[#fcf9f6] border-0 focus:ring-1 focus:ring-[#dab055] text-xs font-bold text-right font-arabic" placeholder="اسم الميزة" value={feature.name_ar} dir="rtl" onChange={(event) => updateFeature(feature.id, { name_ar: event.target.value })} required /></Field>
                      <Field label="EN"><Input className="bg-[#fcf9f6] border-0 focus:ring-1 focus:ring-[#dab055] text-xs font-bold" placeholder="Feature Name" value={feature.name_en} onChange={(event) => updateFeature(feature.id, { name_en: event.target.value })} required /></Field>
                    </div>
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1c1b] mt-4 md:mt-[46px] cursor-pointer group/check">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${feature.isIncluded ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-[#fcf9f6] border-2 border-[#1c1c1b]/10 group-hover/check:border-gray-400'}`}>
                        <input type="checkbox" className="hidden" checked={feature.isIncluded} onChange={(event) => updateFeature(feature.id, { isIncluded: event.target.checked })} />
                        {feature.isIncluded && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={feature.isIncluded ? 'text-green-600' : 'text-[#1c1c1b]/40'}>Included</span>
                    </label>
                    <div className="flex gap-2 items-center mt-2 md:mt-[40px]">
                      <div className="flex bg-[#fcf9f6] rounded-lg overflow-hidden border border-[#1c1c1b]/5">
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-none hover:bg-[#dab055] hover:text-white transition-colors text-[#1c1c1b]/50" onClick={() => moveFeature(feature.id, 'up')}><ArrowUp className="h-3.5 w-3.5" /></Button>
                        <div className="w-[1px] bg-[#1c1c1b]/5"></div>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-none hover:bg-[#dab055] hover:text-white transition-colors text-[#1c1c1b]/50" onClick={() => moveFeature(feature.id, 'down')}><ArrowDown className="h-3.5 w-3.5" /></Button>
                      </div>
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-white hover:bg-red-500 transition-colors rounded-lg bg-red-50" onClick={() => setEditing({ ...editing, features: normalizeFeatures(editing.features.filter((item) => item.id !== feature.id)) })}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error ? <p className="rounded-2xl border-l-4 border-red-500 bg-red-50 px-5 py-4 text-xs font-black uppercase tracking-wider text-red-700 shadow-sm">{error}</p> : null}
            
            <div className="flex justify-end gap-4 mt-2">
              <Button type="button" variant="outline" className="h-12 px-8 rounded-full font-black uppercase tracking-widest text-[10px] border-[#1c1c1b]/20 hover:bg-[#1c1c1b]/5" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" className="h-12 px-10 rounded-full font-black uppercase tracking-widest text-[10px] bg-[#1c1c1b] hover:bg-[#dab055] text-white transition-colors shadow-xl shadow-[#1c1c1b]/20">Save Pricing Plan</Button>
            </div>
          </form>
        ) : null}
      </Dialog>
    </>
  );
}
