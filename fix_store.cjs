const fs = require('fs');

const file = 'D:/playbimboo-backend/play-bimboo/src/context/StoreContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. settings
content = content.replace(
  /const \[settings, setSettings\] = useState<StoreSettings>\(\(\) => \{[\s\S]*?return normalizeStoreSettings\(INITIAL_SETTINGS\);\s*\}\);/,
  `const [settings, setSettings] = useState<StoreSettings>(() => normalizeStoreSettings(INITIAL_SETTINGS));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('playbimboo_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const STALE_MARKERS = ['Gulberg', 'Lahore', 'support@playbimboo', '+92 300', '923001234567', '+327', 'Shafique Center, Gujranwala, Pakistan'];
        const settingsStr = JSON.stringify(parsed);
        if (STALE_MARKERS.some(m => settingsStr.includes(m))) {
          localStorage.removeItem('playbimboo_settings');
        } else {
          if (parsed.freeShippingThreshold === 50) parsed.freeShippingThreshold = 5000;
          setSettings(normalizeStoreSettings(parsed));
        }
      } catch {
        localStorage.removeItem('playbimboo_settings');
      }
    }
  }, []);`
);

// 2. cart
content = content.replace(
  /const \[cart, setCart\] = useState<CartItem\[\]>\(\(\) => \{[\s\S]*?return \[\];\s*\}\);/,
  `const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('playbimboo_cart');
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, []);`
);

// 3. wishlist
content = content.replace(
  /const \[wishlist, setWishlist\] = useState<string\[\]>\(\(\) => \{[\s\S]*?return \[\];\s*\}\);/,
  `const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('playbimboo_wishlist');
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch {}
    }
  }, []);`
);

fs.writeFileSync(file, content);
console.log('Fixed StoreContext.tsx');
