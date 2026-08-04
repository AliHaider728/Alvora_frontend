import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Home, Menu, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { api, getLastApiError, isSuperAdmin } from '../../services/api';
import { HomepageSectionSetting, StorefrontNavigationItem } from '../../types';
import { SeoHead } from '../../components/common/SeoHead';

type Tab = 'navigation' | 'homepage';

const reorder = <T extends { order: number }>(items: T[], index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((item, order) => ({ ...item, order }));
};

export const AdminStoreAppearancePage: React.FC = () => {
  const { settings, updateAppearanceSettings } = useStore();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('navigation');
  const [navigation, setNavigation] = useState<StorefrontNavigationItem[]>([]);
  const [sections, setSections] = useState<HomepageSectionSetting[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [dirty, setDirty] = useState(false);
  const allowed = isSuperAdmin();

  useEffect(() => {
    let active = true;
    void api.getSettings().then(result => {
      if (!active) return;
      if (result) {
        updateAppearanceSettings(result);
      } else {
        setLoadError(getLastApiError() || 'Could not refresh saved appearance settings. Showing safe local defaults.');
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setNavigation(settings.storefrontNavigation.map(item => ({ ...item })).sort((a, b) => a.order - b.order));
    setSections(settings.homepageSections.map(item => ({ ...item })).sort((a, b) => a.order - b.order));
  }, [settings.storefrontNavigation, settings.homepageSections]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    const warnOnNavigation = (event: MouseEvent) => {
      if (!dirty) return;
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor || anchor.target === '_blank') return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      if (!window.confirm('You have unsaved appearance changes. Leave this page?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener('click', warnOnNavigation, true);
    return () => document.removeEventListener('click', warnOnNavigation, true);
  }, [dirty]);

  const markNavigation = (next: StorefrontNavigationItem[]) => {
    setNavigation(next);
    setDirty(true);
  };
  const markSections = (next: HomepageSectionSetting[]) => {
    setSections(next);
    setDirty(true);
  };
  const errors = useMemo(() => [
    ...navigation.filter(item => !item.label.trim()).map(item => `${item.key} needs a label`),
    ...sections.filter(item => !item.heading?.trim()).map(item => `${item.name} needs a heading`)
  ], [navigation, sections]);

  const save = async () => {
    if (errors.length) {
      showToast(errors[0], 'error');
      return;
    }
    setSaving(true);
    const result = await api.updateAppearance({ storefrontNavigation: navigation, homepageSections: sections });
    setSaving(false);
    if (!result) {
      showToast(getLastApiError() || 'Could not save storefront appearance.', 'error');
      return;
    }
    updateAppearanceSettings(result);
    setDirty(false);
    showToast('Storefront appearance saved.', 'success');
  };

  const reset = async () => {
    if (!window.confirm('Reset navigation and homepage sections to the PlayBimboo defaults?')) return;
    setSaving(true);
    const result = await api.resetAppearance();
    setSaving(false);
    if (!result) {
      showToast(getLastApiError() || 'Could not reset storefront appearance.', 'error');
      return;
    }
    updateAppearanceSettings(result);
    setDirty(false);
    showToast('Storefront appearance reset to defaults.', 'info');
  };

  if (!allowed) {
    return (
      <div className="max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <ShieldAlert className="mb-3 h-8 w-8 text-amber-600" />
        <h1 className="font-heading text-xl font-black text-slate-900">Super Admin access required</h1>
        <p className="mt-2 text-sm text-slate-600">Only a Super Admin can change storefront navigation, homepage order, or public marketing copy.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm font-bold text-slate-500">Loading storefront appearance…</div>;
  }

  return (
    <div className="space-y-6">
      <SeoHead title="Store Appearance" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-900">Store Appearance</h1>
          <p className="text-xs font-medium text-slate-500">Control storefront navigation and homepage sections from one safe configuration.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => void reset()} disabled={saving} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 disabled:opacity-50">
            <RotateCcw className="h-4 w-4" /> Reset defaults
          </button>
          <button type="button" onClick={() => void save()} disabled={saving || !dirty} className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save appearance'}
          </button>
        </div>
      </div>

      <div className="flex w-fit rounded-2xl bg-slate-200/70 p-1">
        {(['navigation', 'homepage'] as Tab[]).map(value => (
          <button key={value} type="button" onClick={() => setTab(value)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ${tab === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            {value === 'navigation' ? <Menu className="h-4 w-4" /> : <Home className="h-4 w-4" />}
            {value === 'navigation' ? 'Navigation' : 'Homepage'}
          </button>
        ))}
      </div>

      {loadError && <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">{loadError}</div>}

      {navigation.length === 0 || sections.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-semibold text-slate-500">Appearance settings are empty. Use Reset defaults to restore the safe PlayBimboo configuration.</div>
      ) : tab === 'navigation' ? (
        <div className="space-y-3">
          {navigation.map((item, index) => (
            <div key={item.key} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:grid-cols-[auto_minmax(180px,1fr)_repeat(4,auto)] lg:items-center">
              <div className="flex gap-1">
                <button type="button" aria-label={`Move ${item.label} up`} disabled={index === 0} onClick={() => markNavigation(reorder(navigation, index, -1))} className="rounded-lg border p-2 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button type="button" aria-label={`Move ${item.label} down`} disabled={index === navigation.length - 1} onClick={() => markNavigation(reorder(navigation, index, 1))} className="rounded-lg border p-2 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
              </div>
              <label className="text-[11px] font-bold text-slate-500">Label
                <input maxLength={40} value={item.label} onChange={event => markNavigation(navigation.map(row => row.key === item.key ? { ...row, label: event.target.value } : row))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" />
              </label>
              {(['visible', 'enabled', 'showOnDesktop', 'showOnMobile'] as const).map(field => (
                <label key={field} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <input type="checkbox" checked={item[field]} onChange={event => markNavigation(navigation.map(row => row.key === item.key ? { ...row, [field]: event.target.checked } : row))} />
                  {{ visible: 'Visible', enabled: 'Enabled', showOnDesktop: 'Desktop', showOnMobile: 'Mobile' }[field]}
                </label>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex gap-1">
                  <button type="button" aria-label={`Move ${section.name} up`} disabled={index === 0} onClick={() => markSections(reorder(sections, index, -1))} className="rounded-lg border p-2 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" aria-label={`Move ${section.name} down`} disabled={index === sections.length - 1} onClick={() => markSections(reorder(sections, index, 1))} className="rounded-lg border p-2 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                </div>
                <h2 className="mr-auto font-heading text-sm font-black text-slate-900">{section.name}</h2>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={section.enabled} onChange={event => markSections(sections.map(row => row.key === section.key ? { ...row, enabled: event.target.checked } : row))} /> Enabled</label>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <AppearanceField label="Heading" value={section.heading || ''} maxLength={120} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, heading: value } : row))} />
                <AppearanceField label="Subheading" value={section.subheading || ''} maxLength={320} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, subheading: value } : row))} />
                {section.ctaLabel !== undefined && <AppearanceField label="Button label" value={section.ctaLabel} maxLength={60} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, ctaLabel: value } : row))} />}
                {section.ctaLink !== undefined && <AppearanceField label="Button link (internal)" value={section.ctaLink} maxLength={200} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, ctaLink: value } : row))} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AppearanceField: React.FC<{ label: string; value: string; maxLength: number; onChange: (value: string) => void }> = ({ label, value, maxLength, onChange }) => (
  <label className="text-[11px] font-bold text-slate-600">{label}
    <input value={value} maxLength={maxLength} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900" />
    <span className="mt-1 block text-right text-[10px] text-slate-400">{value.length}/{maxLength}</span>
  </label>
);
