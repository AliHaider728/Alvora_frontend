import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Home, Menu, Plus, RotateCcw, Save, ShieldAlert, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { api, getLastApiError, isSuperAdmin } from '../../services/api';
import { HomepageSectionSetting, NavigationLinkType, StorefrontNavigationItem } from '../../types';
import { INTERNAL_PAGE_OPTIONS } from '../../config/storeAppearance';
import { SeoHead } from '../../components/common/SeoHead';

type Tab = 'navigation' | 'homepage';
const makeId = () => `nav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const resequence = (items: StorefrontNavigationItem[]) => {
  const parents = items.filter(item => !item.parentId).map((item, index) => ({ ...item, displayOrder: index, order: index }));
  const children = parents.flatMap(parent => items.filter(item => item.parentId === parent.id).map((item, index) => ({ ...item, displayOrder: index, order: index })));
  return [...parents, ...children];
};
const createItem = (parentId: string | null = null): StorefrontNavigationItem => {
  const id = makeId();
  return { id, key: id, label: parentId ? 'New Child Link' : 'New Navigation Item', linkType: 'custom_internal_url', menuType: 'link', path: '/category/all', parentId, visible: true, enabled: true, showOnDesktop: true, showOnMobile: true, displayOrder: 999, order: 999, isSystemItem: false };
};

export const AdminStoreAppearancePage: React.FC = () => {
  const { settings, categories, updateAppearanceSettings } = useStore();
  const { toast } = useToast();
  const { confirm } = useDialog();
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
    void api.getAdminAppearance().then(result => {
      if (!active) return;
      if (result) { setNavigation(resequence(result.storefrontNavigation || [])); setSections((result.homepageSections || []).sort((a: HomepageSectionSetting, b: HomepageSectionSetting) => a.order - b.order)); }
      else setLoadError(getLastApiError() || 'Could not load saved appearance settings.');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (!dirty) return; event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    const warnOnNavigation = (event: MouseEvent) => {
      if (!dirty) return;
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor || anchor.target === '_blank') return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      event.preventDefault(); event.stopPropagation();
      void confirm({ title: 'You have unsaved changes.', description: 'Leaving now will discard the appearance changes you have not saved.', cancelLabel: 'Stay on Page', confirmLabel: 'Discard Changes', destructive: true }).then(leave => { if (leave) window.location.assign(destination.href); });
    };
    document.addEventListener('click', warnOnNavigation, true); return () => document.removeEventListener('click', warnOnNavigation, true);
  }, [confirm, dirty]);

  const markNavigation = (next: StorefrontNavigationItem[], message?: string) => { setNavigation(resequence(next)); setDirty(true); if (message) toast.info(message); };
  const markSections = (next: HomepageSectionSetting[]) => { setSections(next.map((item, order) => ({ ...item, order }))); setDirty(true); };
  const parents = useMemo(() => navigation.filter(item => !item.parentId).sort((a, b) => a.displayOrder - b.displayOrder), [navigation]);
  const errors = useMemo(() => {
    const messages = navigation.filter(item => !item.label.trim()).map(() => 'Every navigation item needs a label.');
    navigation.forEach(item => {
      if (item.linkType === 'category' && !item.categoryId) messages.push(`${item.label} needs a category.`);
      if (item.linkType === 'custom_internal_url' && (!item.path?.startsWith('/') || item.path.startsWith('/admin'))) messages.push(`${item.label} needs a safe public path beginning with /.`);
      if (item.linkType === 'external_url' && !/^https:\/\//i.test(item.externalUrl || '')) messages.push(`${item.label} needs a valid HTTPS URL.`);
    });
    sections.filter(item => !item.heading?.trim()).forEach(item => messages.push(`${item.name} needs a heading.`));
    return messages;
  }, [navigation, sections]);

  const patchItem = (id: string, changes: Partial<StorefrontNavigationItem>) => markNavigation(navigation.map(item => item.id === id ? { ...item, ...changes } : item));
  const addParent = () => { markNavigation([...navigation, createItem()], 'Navigation item added. Configure it, then save.'); };
  const addChild = (parent: StorefrontNavigationItem) => { markNavigation([...navigation, createItem(parent.id)], `Child link added to ${parent.label}.`); };
  const duplicate = (item: StorefrontNavigationItem) => {
    const id = makeId(); const copy = { ...item, id, key: id, label: `${item.label} Copy`, isSystemItem: false };
    markNavigation([...navigation, copy], 'Navigation item duplicated.');
  };
  const remove = async (item: StorefrontNavigationItem) => {
    const childCount = navigation.filter(child => child.parentId === item.id).length;
    const accepted = await confirm({ title: 'Delete this navigation item?', description: childCount ? `This dropdown and its ${childCount} child link(s) will be removed when you save.` : 'This custom navigation item will be removed when you save.', cancelLabel: 'Keep Item', confirmLabel: 'Delete Item', destructive: true });
    if (accepted) markNavigation(navigation.filter(row => row.id !== item.id && row.parentId !== item.id), 'Navigation item removed. Save to publish this change.');
  };
  const changeMenuType = async (item: StorefrontNavigationItem, menuType: 'link' | 'dropdown') => {
    if (menuType === 'link') {
      const children = navigation.filter(row => row.parentId === item.id);
      if (children.length && !await confirm({ title: 'Convert to a direct link?', description: `${children.length} child link(s) will be removed.`, confirmLabel: 'Convert and Remove Children', destructive: true })) return;
      markNavigation(navigation.filter(row => row.parentId !== item.id).map(row => row.id === item.id ? { ...row, menuType } : row));
    } else patchItem(item.id, { menuType, path: undefined, externalUrl: undefined, categoryId: undefined });
  };
  const move = (item: StorefrontNavigationItem, direction: -1 | 1) => {
    const siblings = navigation.filter(row => (row.parentId || null) === (item.parentId || null)).sort((a, b) => a.displayOrder - b.displayOrder);
    const index = siblings.findIndex(row => row.id === item.id); const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
    const order = new Map(siblings.map((row, position) => [row.id, position]));
    markNavigation(navigation.map(row => order.has(row.id) ? { ...row, displayOrder: order.get(row.id)!, order: order.get(row.id)! } : row));
  };

  const reloadAdminAppearance = async () => {
    const fresh = await api.getAdminAppearance();
    if (fresh) { setNavigation(resequence(fresh.storefrontNavigation || [])); setSections((fresh.homepageSections || []).sort((a: HomepageSectionSetting, b: HomepageSectionSetting) => a.order - b.order)); updateAppearanceSettings(fresh); }
  };
  const save = async () => {
    if (errors.length) { toast.error(errors[0]); return; }
    setSaving(true); const loadingId = toast.loading('Saving storefront appearance…');
    const result = await api.updateAppearance({ storefrontNavigation: resequence(navigation), homepageSections: sections });
    if (result) { await reloadAdminAppearance(); setDirty(false); toast.update(loadingId, 'Storefront navigation and homepage settings saved.', 'success'); }
    else toast.update(loadingId, getLastApiError() || 'Could not save storefront appearance.', 'error');
    setSaving(false);
  };
  const reset = async () => {
    if (!await confirm({ title: 'Reset appearance settings?', description: 'Navigation and homepage settings will return to their defaults.', cancelLabel: 'Keep Current Settings', confirmLabel: 'Reset to Defaults', destructive: true })) return;
    setSaving(true); const result = await api.resetAppearance();
    if (result) { await reloadAdminAppearance(); setDirty(false); toast.info('Storefront appearance reset to defaults.'); } else toast.error(getLastApiError() || 'Could not reset storefront appearance.');
    setSaving(false);
  };

  if (!allowed) return <div className="max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8"><ShieldAlert className="mb-3 h-8 w-8 text-amber-600" /><h1 className="font-heading text-xl font-black text-slate-900">Super Admin access required</h1><p className="mt-2 text-sm text-slate-600">Only a Super Admin can change storefront navigation and homepage appearance.</p></div>;
  if (loading) return <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border bg-white text-sm font-bold text-slate-500">Loading storefront appearance…</div>;

  return <div className="space-y-6"><SeoHead title="Store Appearance" />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-heading text-2xl font-black text-slate-900">Store Appearance</h1><p className="text-xs font-medium text-slate-500">Build database-driven navigation and organize homepage content.</p></div><div className="flex flex-wrap gap-2">{tab === 'navigation' && <button type="button" onClick={addParent} className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700"><Plus className="h-4 w-4" /> Add Navigation Item</button>}<button type="button" onClick={() => void reset()} disabled={saving} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-xs font-bold text-slate-700"><RotateCcw className="h-4 w-4" /> Reset defaults</button><button type="button" onClick={() => void save()} disabled={saving || !dirty} className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save appearance'}</button></div></div>
    <div className="flex w-fit rounded-2xl bg-slate-200/70 p-1">{(['navigation', 'homepage'] as Tab[]).map(value => <button key={value} type="button" onClick={() => setTab(value)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ${tab === value ? 'bg-white shadow-sm' : 'text-slate-500'}`}>{value === 'navigation' ? <Menu className="h-4 w-4" /> : <Home className="h-4 w-4" />}{value === 'navigation' ? 'Navigation' : 'Homepage'}</button>)}</div>
    {loadError && <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">{loadError}</div>}
    {tab === 'navigation' ? <div className="space-y-4">{parents.map(parent => <div key={parent.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5"><NavigationEditor item={parent} categories={categories} siblings={parents} patchItem={patchItem} move={move} changeMenuType={changeMenuType} duplicate={duplicate} remove={remove} addChild={addChild} />{parent.menuType === 'dropdown' && <div className="mt-4 space-y-3 border-l-2 border-rose-100 pl-3 sm:pl-6">{navigation.filter(child => child.parentId === parent.id).sort((a, b) => a.displayOrder - b.displayOrder).map(child => <div key={child.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><NavigationEditor item={child} categories={categories} siblings={navigation.filter(row => row.parentId === parent.id)} patchItem={patchItem} move={move} duplicate={duplicate} remove={remove} /></div>)}<button type="button" onClick={() => addChild(parent)} className="flex items-center gap-2 rounded-xl border border-dashed border-rose-300 px-4 py-2.5 text-xs font-bold text-rose-600"><Plus className="h-4 w-4" /> Add Child Link</button></div>}</div>)}</div> : <div className="space-y-3">{sections.map((section, index) => <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"><div className="mb-4 flex flex-wrap items-center gap-3"><div className="flex gap-1"><button type="button" disabled={index === 0} onClick={() => { const next = [...sections]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; markSections(next); }} className="rounded-lg border p-2 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" disabled={index === sections.length - 1} onClick={() => { const next = [...sections]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; markSections(next); }} className="rounded-lg border p-2 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button></div><h2 className="mr-auto font-heading text-sm font-black">{section.name}</h2><label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={section.enabled} onChange={e => markSections(sections.map(row => row.key === section.key ? { ...row, enabled: e.target.checked } : row))} /> Enabled</label></div><div className="grid gap-4 lg:grid-cols-2"><AppearanceField label="Heading" value={section.heading || ''} maxLength={120} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, heading: value } : row))} /><AppearanceField label="Subheading" value={section.subheading || ''} maxLength={320} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, subheading: value } : row))} />{section.ctaLabel !== undefined && <AppearanceField label="Button label" value={section.ctaLabel} maxLength={60} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, ctaLabel: value } : row))} />}{section.ctaLink !== undefined && <AppearanceField label="Button link" value={section.ctaLink} maxLength={200} onChange={value => markSections(sections.map(row => row.key === section.key ? { ...row, ctaLink: value } : row))} />}</div></div>)}</div>}
  </div>;
};

type EditorProps = { item: StorefrontNavigationItem; categories: ReturnType<typeof useStore>['categories']; siblings: StorefrontNavigationItem[]; patchItem: (id: string, changes: Partial<StorefrontNavigationItem>) => void; move: (item: StorefrontNavigationItem, direction: -1 | 1) => void; changeMenuType?: (item: StorefrontNavigationItem, type: 'link' | 'dropdown') => void; duplicate: (item: StorefrontNavigationItem) => void; remove: (item: StorefrontNavigationItem) => void; addChild?: (item: StorefrontNavigationItem) => void };
const NavigationEditor: React.FC<EditorProps> = ({ item, categories, siblings, patchItem, move, changeMenuType, duplicate, remove }) => {
  const ordered = [...siblings].sort((a, b) => a.displayOrder - b.displayOrder); const index = ordered.findIndex(row => row.id === item.id);
  const field = 'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm';
  return <div className="space-y-4"><div className="flex flex-wrap items-center gap-2"><div className="flex gap-1"><button type="button" disabled={index <= 0} onClick={() => move(item, -1)} aria-label={`Move ${item.label} up`} className="rounded-lg border p-2 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" disabled={index === ordered.length - 1} onClick={() => move(item, 1)} aria-label={`Move ${item.label} down`} className="rounded-lg border p-2 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button></div><span className="mr-auto rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">{item.isSystemItem ? 'SYSTEM' : item.parentId ? 'CHILD' : 'CUSTOM'}</span>{!item.isSystemItem && <button type="button" onClick={() => duplicate(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={`Duplicate ${item.label}`}><Copy className="h-4 w-4" /></button>}{!item.isSystemItem && <button type="button" onClick={() => void remove(item)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${item.label}`}><Trash2 className="h-4 w-4" /></button>}</div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-[11px] font-bold text-slate-600">Label<input value={item.label} maxLength={60} onChange={e => patchItem(item.id, { label: e.target.value })} className={field} /></label>{!item.parentId && <label className="text-[11px] font-bold text-slate-600">Menu Type<select value={item.menuType} onChange={e => changeMenuType?.(item, e.target.value as 'link' | 'dropdown')} className={field}><option value="link">Link</option><option value="dropdown">Dropdown</option></select></label>}{item.menuType === 'link' && <><label className="text-[11px] font-bold text-slate-600">Link Type<select value={item.linkType} onChange={e => patchItem(item.id, { linkType: e.target.value as NavigationLinkType, path: undefined, externalUrl: undefined, categoryId: undefined })} className={field}><option value="internal_page">Internal Page</option><option value="category">Category</option><option value="custom_internal_url">Custom Internal URL</option><option value="external_url">External HTTPS URL</option></select></label><Destination item={item} categories={categories} patchItem={patchItem} field={field} /></>}<label className="text-[11px] font-bold text-slate-600">Badge (optional)<input value={item.badgeText || ''} maxLength={20} onChange={e => patchItem(item.id, { badgeText: e.target.value })} className={field} placeholder="New" /></label></div>
    <div className="flex flex-wrap gap-4">{(['visible', 'enabled', 'showOnDesktop', 'showOnMobile'] as const).map(key => <label key={key} className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={item[key]} onChange={e => patchItem(item.id, { [key]: e.target.checked })} />{{ visible: 'Visible', enabled: 'Enabled', showOnDesktop: 'Desktop', showOnMobile: 'Mobile' }[key]}</label>)}{item.linkType === 'external_url' && item.menuType === 'link' && <label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={item.openInNewTab === true} onChange={e => patchItem(item.id, { openInNewTab: e.target.checked })} /> Open in new tab</label>}</div>
  </div>;
};
const Destination: React.FC<{ item: StorefrontNavigationItem; categories: ReturnType<typeof useStore>['categories']; patchItem: EditorProps['patchItem']; field: string }> = ({ item, categories, patchItem, field }) => item.linkType === 'internal_page' ? <label className="text-[11px] font-bold text-slate-600">Page<select value={item.path || '/'} onChange={e => patchItem(item.id, { path: e.target.value })} className={field}>{INTERNAL_PAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label> : item.linkType === 'category' ? <label className="text-[11px] font-bold text-slate-600">Category<select value={item.categoryId || ''} onChange={e => patchItem(item.id, { categoryId: e.target.value })} className={field}><option value="">Choose category</option>{categories.filter(category => category.isActive !== false).map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label> : item.linkType === 'external_url' ? <label className="text-[11px] font-bold text-slate-600">HTTPS URL<input value={item.externalUrl || ''} onChange={e => patchItem(item.id, { externalUrl: e.target.value })} className={field} placeholder="https://example.com" /></label> : <label className="text-[11px] font-bold text-slate-600">Public Path<input value={item.path || ''} onChange={e => patchItem(item.id, { path: e.target.value })} className={field} placeholder="/collections/new" /></label>;
const AppearanceField: React.FC<{ label: string; value: string; maxLength: number; onChange: (value: string) => void }> = ({ label, value, maxLength, onChange }) => <label className="text-[11px] font-bold text-slate-600">{label}<input value={value} maxLength={maxLength} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /><span className="mt-1 block text-right text-[10px] text-slate-400">{value.length}/{maxLength}</span></label>;
