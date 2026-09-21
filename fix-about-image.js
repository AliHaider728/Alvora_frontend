const fs = require('fs');
let c = fs.readFileSync('src/app/about/AboutPageClient.tsx', 'utf8');

// 1. Change items-center to items-stretch on the flex container
c = c.replace(/<div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">/, '<div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">');

// 2. Center the text vertically inside the left column
c = c.replace(/className="w-full lg:w-1\/2"\s*\n\s*initial="hidden"/, 'className="w-full lg:w-1/2 flex flex-col justify-center"\n            initial="hidden"');

// 3. Update the right column to use absolute inset-0 to fill the stretched height (with a min-height for mobile)
c = c.replace(/className="relative aspect-\[4\/5\] md:aspect-square lg:aspect-\[4\/5\] w-full rounded-2xl overflow-hidden shadow-xl"/, 'className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-xl"');

// 4. Update the wrapper to have a min-height so mobile doesn't collapse
c = c.replace(/className="w-full lg:w-1\/2 relative"\s*\n\s*initial="hidden"/, 'className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[500px] lg:min-h-0"\n            initial="hidden"');

fs.writeFileSync('src/app/about/AboutPageClient.tsx', c, 'utf8');
