import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, Heart, User, Store, Info, Mail, Link2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { orderedVisibleNavigation } from '../../config/storeAppearance';

export const MobileBottomNav: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen, settings } = useStore();
  const location = useLocation();

  const iconByKey = { home: Home, shop: Store, categories: LayoutGrid, about: Info, contact: Mail, wishlist: Heart, account: User };
  const configuredItems = orderedVisibleNavigation(settings, 'mobile').filter(item => !item.parentId && item.menuType === 'link').slice(0, 4).map(item => ({
    ...item,
    icon: iconByKey[item.key as keyof typeof iconByKey] || Link2,
    badge: item.key === 'wishlist' ? wishlist.length : undefined
  }));
  const cartItem = {
      label: 'Cart',
      path: '#cart',
      icon: ShoppingBag,
      badge: cartTotalItems,
      enabled: true,
      onClick: () => setIsCartOpen(true)
  };
  const navItems = [...configuredItems.slice(0, 2), cartItem, ...configuredItems.slice(2)];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg xl:hidden h-16">
      <div className="grid h-full max-w-xl mx-auto" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const destination = 'externalUrl' in item && item.linkType === 'external_url' ? item.externalUrl : item.path;
          const isActive = destination !== '#cart' && Boolean(destination) && (
            destination === '/'
              ? location.pathname === '/' 
              : location.pathname.startsWith(destination || '')
          );

          if ('onClick' in item) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-rose-500 transition-colors relative"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-slate-700 hover:text-rose-500" />
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span key={`cart-badge-${item.badge}`} className="cart-count-pop absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-heading font-bold mt-1 text-slate-600">
                  {item.label}
                </span>
              </button>
            );
          }

          if (!item.enabled) {
            return (
              <button key={item.key} type="button" disabled aria-disabled="true" title="Coming soon" className="flex flex-col items-center justify-center py-1 text-slate-300">
                <Icon className="h-5 w-5" />
                <span className="mt-1 max-w-full truncate px-1 text-[10px] font-bold">{item.label}</span>
              </button>
            );
          }

          if (item.linkType === 'external_url') return (
            <a key={item.id} href={item.externalUrl} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noopener noreferrer' : undefined} className="flex flex-col items-center justify-center py-1 text-slate-500 transition hover:text-rose-600">
              <Icon className="h-5 w-5" /><span className="mt-1 max-w-full truncate px-1 text-[10px] font-bold">{item.label}</span>
            </a>
          );

          return (
            <NavLink
              key={item.key}
              to={item.path || '/'}
              className={({ isActive: linkActive }) => `
                flex flex-col items-center justify-center py-1 transition-all relative
                ${linkActive || isActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-semibold'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 stroke-[2.5px]' : 'text-slate-600'}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span key={`nav-badge-${item.key}-${item.badge}`} className="cart-count-pop absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-heading mt-1 ${isActive ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-rose-500 rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
