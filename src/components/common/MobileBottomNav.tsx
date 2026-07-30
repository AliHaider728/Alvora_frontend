import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { cartTotalItems, wishlist, setIsCartOpen } = useStore();
  const location = useLocation();

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home
    },
    {
      label: 'Categories',
      path: '/category/all',
      icon: LayoutGrid
    },
    {
      label: 'Cart',
      path: '#cart',
      icon: ShoppingBag,
      badge: cartTotalItems,
      onClick: () => setIsCartOpen(true)
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
      badge: wishlist.length
    },
    {
      label: 'Account',
      path: '/account',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg md:hidden h-16">
      <div className="grid grid-cols-5 h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path !== '#cart' && (
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path)
          );

          if (item.onClick) {
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
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive: linkActive }) => `
                flex flex-col items-center justify-center py-1 transition-all relative
                ${linkActive || isActive ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-semibold'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 stroke-[2.5px]' : 'text-slate-600'}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
