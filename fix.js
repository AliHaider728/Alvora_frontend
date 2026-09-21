const fs = require('fs');
let c = fs.readFileSync('src/components/home/BundleSection.tsx', 'utf8');

const regex = /<div className=\{\`w-full h-full \$\{imageBgClass\} relative overflow-hidden \$\{isReverse \? "md:order-2" : "md:order-1"\}\`\}>[\s\S]*?(?=\s*\{\/\* Content Side \*\/)/;

const newCol = `<div className={\`w-full h-full \${imageBgClass} flex items-center justify-center p-8 lg:p-16 \${isReverse ? "md:order-2" : "md:order-1"}\`}>
              {displayImage ? (
                <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-sm bg-white">
                  <Image 
                    src={displayImage} 
                    alt={bundle.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3 opacity-60">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                      <span className="font-display text-3xl text-white/80">Alvora</span>
                    </div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{bundle.name}</p>
                  </div>
                </div>
              )}
              {discountValue > 0 && (
                <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-[#9C4122] text-white text-[10px] font-bold px-4 py-2 uppercase tracking-widest z-10 rounded-full shadow-sm">
                  Save {discountValue}%
                </div>
              )}
            </div>`;

c = c.replace(regex, newCol);
fs.writeFileSync('src/components/home/BundleSection.tsx', c);
