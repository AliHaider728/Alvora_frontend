const fs = require('fs');

let content = fs.readFileSync('src/components/common/Header.tsx', 'utf8');

content = content.replace(
  'className="hidden lg:flex items-center gap-8 w-1/3"',
  'className="hidden lg:flex items-center gap-10 xl:gap-14 w-1/3"'
);

content = content.replace(
  'font-body text-[11px] font-bold tracking-widest uppercase',
  'font-body text-[11px] font-bold tracking-[0.2em] uppercase'
);

const oldCart = `              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={\`Cart, \${mounted ? cartTotalItems : 0} items\`}
                className="
                  relative flex items-center gap-2 px-4 py-2
                  bg-[#C48B80] hover:bg-[#4D3D2D] text-white
                  text-sm font-semibold tracking-wide
                  transition-colors duration-200
                "
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Bag</span>
                {mounted && cartTotalItems > 0 && (
                  <span
                    key={cartTotalItems}
                    className="cart-count-pop inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#C48B80] text-[10px] font-bold"
                  >
                    {cartTotalItems}
                  </span>
                )}
              </button>`;

const newCart = `              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={\`Cart, \${mounted ? cartTotalItems : 0} items\`}
                className="
                  relative p-2 rounded-full text-[#1A1A1A]
                  hover:text-[#C48B80] hover:bg-[#F5EDE4] transition-colors
                "
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                {mounted && cartTotalItems > 0 && (
                  <span
                    key={cartTotalItems}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#C48B80] text-white text-[9px] font-bold flex items-center justify-center cart-count-pop"
                  >
                    {cartTotalItems}
                  </span>
                )}
              </button>`;

content = content.replace(oldCart, newCart);
fs.writeFileSync('src/components/common/Header.tsx', content);
console.log('Header updated!');
