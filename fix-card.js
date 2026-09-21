const fs = require('fs');
let c = fs.readFileSync('src/app/bundles/build/page.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Right: Sticky Summary \*\/\}/;

const newGrid = `<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => {
                const selectedItem = selectedItems.find(p => p.product.id === product.id);
                const selectedQty = selectedItem ? selectedItem.quantity : 0;

                return (
                  <div 
                    key={product.id}
                    className={\`relative flex flex-col bg-white rounded-[20px] p-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 \${selectedQty > 0 ? 'border border-[#C48B80] ring-1 ring-[#C48B80]/30' : 'border border-[#F5EDE4] hover:shadow-[0_4px_16px_rgb(0,0,0,0.04)] hover:-translate-y-0.5'}\`}
                  >
                    {selectedQty > 0 && (
                      <div className="absolute top-5 right-5 z-20 w-6 h-6 bg-[#C48B80] rounded-full flex items-center justify-center text-white shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="relative aspect-[4/5] bg-[#F9F7F5] w-full overflow-hidden rounded-[14px] mb-4">
                      {product.images && product.images.length > 0 && (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover mix-blend-multiply opacity-90 p-3" 
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow px-1 flex flex-col">
                      <h3 className="font-display text-[13px] font-bold text-[#1A1A1A] mb-1 line-clamp-2 leading-tight min-h-[34px]">{product.name}</h3>
                      <p className="text-[#1A1A1A]/60 text-[12px] font-medium mb-1.5">{formatPrice(product.price)}</p>
                      
                      <p className="text-[#1A1A1A]/50 text-[10px] leading-relaxed line-clamp-2 min-h-[30px] mb-4">
                        {product.shortDescription || product.description || 'Nourishing daily essential.'}
                      </p>
                      
                      <div className="mt-auto h-[38px]">
                        {selectedQty > 0 ? (
                          <div className="w-full h-full flex items-center justify-between bg-[#FDF8F5] border border-[#F1C9BD] rounded-full px-5">
                            <button 
                              onClick={() => handleRemoveProduct(product)}
                              className="text-[#C48B80] hover:scale-125 transition-transform p-1"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <span className="text-[#C48B80] text-xs font-bold">{selectedQty}</span>
                            <button 
                              onClick={() => handleAddProduct(product)}
                              className="text-[#C48B80] hover:scale-125 transition-transform p-1"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddProduct(product)}
                            className="w-full h-full flex items-center justify-center gap-2 bg-[#FAF6F2] hover:bg-[#F5EDE4] text-[#1A1A1A] text-[10px] font-bold tracking-wide rounded-full transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Routine
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sticky Summary */}`;

c = c.replace(regex, newGrid);

fs.writeFileSync('src/app/bundles/build/page.tsx', c, 'utf8');
