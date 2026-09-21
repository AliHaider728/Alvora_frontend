const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/build/page.tsx', 'utf8');

c = c.replace(/const MAX_PRODUCTS = 3;/g, 'const MIN_PRODUCTS = 2;');

c = c.replace(/if \(totalQuantity >= MAX_PRODUCTS\) return;/g, '');
c = c.replace(/if \(totalQuantity < MAX_PRODUCTS\) return;/g, 'if (selectedItems.length < MIN_PRODUCTS) return;');
c = c.replace(/Select \{MAX_PRODUCTS\} items to create your perfect personalized regimen and save 15\%\./g, 'Select at least {MIN_PRODUCTS} items to build your routine and save 15%.');

c = c.replace(/const isFull = totalQuantity >= MAX_PRODUCTS;/g, 'const isFull = false;');

c = c.replace(/\{\[\.\.\.Array\(MAX_PRODUCTS\)\]\.map\(\(\_, i\) => \{[\s\S]*?\}\)\}/g, `{selectedItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <p className="text-sm text-[#1A1A1A]/40 italic">Start building your routine by adding products from the left.</p>
                      </div>
                    ) : (
                      selectedItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0 relative">
                          <button 
                            onClick={() => handleRemoveProduct(item.product)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 hover:bg-[#C48B80] text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
                            aria-label="Remove item"
                          >
                            <span className="text-xs font-bold leading-none mb-0.5">&times;</span>
                          </button>
                          <div className="w-16 h-16 bg-[#FAF6F2] relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                            {item.product?.images?.[0] && (
                              <Image 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                fill
                                sizes="64px"
                                className="object-cover" 
                              />
                            )}
                          </div>
                          <div className="flex-grow flex flex-col gap-1">
                            <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1 pr-4">{item.product.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-[#1A1A1A]/60">{formatPrice(item.product.price)}</p>
                              
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-7">
                                <button 
                                  onClick={() => handleRemoveProduct(item.product)}
                                  className="w-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => handleAddProduct(item.product)}
                                  className="w-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}`);

c = c.replace(/\{totalQuantity === MAX_PRODUCTS && \(/g, '{selectedItems.length >= MIN_PRODUCTS && (');
c = c.replace(/totalQuantity === MAX_PRODUCTS \? 'line-through text-\[\#1A1A1A\]\/40' : 'text-\[\#1A1A1A\]'/g, "selectedItems.length >= MIN_PRODUCTS ? 'line-through text-[#1A1A1A]/40' : 'text-[#1A1A1A]'");

const oldButtonClass = "totalQuantity === MAX_PRODUCTS ? 'bg-[#1A1A1A] hover:bg-[#C48B80] text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'";
const newButtonClass = "selectedItems.length >= MIN_PRODUCTS ? 'bg-[#1A1A1A] hover:bg-[#C48B80] text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'";
c = c.replace(oldButtonClass, newButtonClass);

const oldButtonText = "{totalQuantity < MAX_PRODUCTS ? `Select ${MAX_PRODUCTS - totalQuantity} More` : 'Add Routine to Cart'}";
const newButtonText = "{selectedItems.length < MIN_PRODUCTS ? (selectedItems.length === 0 ? 'Select at least 2 items' : `Select ${MIN_PRODUCTS - selectedItems.length} More to unlock 15% off`) : 'Add Routine to Cart'}";
c = c.replace(oldButtonText, newButtonText);
c = c.replace(/disabled=\{totalQuantity < MAX_PRODUCTS\}/g, 'disabled={selectedItems.length < MIN_PRODUCTS}');

const addToCartImpl = `  const handleAddBundleToCart = () => {
    if (selectedItems.length < MIN_PRODUCTS) return;

    const bundleItem = {
      id: 'custom-routine-' + Date.now(),
      productType: 'bundle',
      name: 'Your Custom Routine',
      price: finalPrice,
      slug: 'build',
      bundleData: {
        products: selectedItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          bundle_quantity: item.quantity,
          price: item.product.price,
          product: item.product
        }))
      },
      images: selectedItems.length > 0 ? selectedItems[0].product.images : [],
      inStock: true,
      category: 'Bundles',
      categorySlug: 'bundles',
      sku: 'CUSTOM-ROUTINE',
      rating: 5,
      reviewCount: 0,
      tags: [],
      features: [],
      safetyInfo: '',
      specifications: {},
      ageGroups: [],
      isVisibleOnStorefront: false,
      status: 'active'
    };

    addToCart(bundleItem as any, 1);
    setSelectedItems([]);
    setIsCartOpen(true);
  };`;

c = c.replace(/const handleAddBundleToCart = \(\) => \{[\s\S]*?setIsCartOpen\(true\);\n  \};/m, addToCartImpl);

fs.writeFileSync('src/app/bundles/build/page.tsx', c);
