const fs = require('fs');

// Update ConcernGrid.tsx
let cg = fs.readFileSync('src/components/home/ConcernGrid.tsx', 'utf8');

if (!cg.includes('import Image')) {
  cg = cg.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
}

const oldConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-[#C48B80]' // Terracotta
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-[#B8664C]' // Deeper Terracotta
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-[#8C6B61]' // Muted Warm Brown
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-[#EADED2]' // Warm beige
    }
  ];`;

const newConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      image: '/images/concern-hydration.jpg'
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      image: '/images/concern-brightening.jpg'
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      image: '/images/concern-acne.jpg'
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      image: '/images/concern-barrier.jpg'
    }
  ];`;

cg = cg.replace(oldConcerns, newConcerns);

const oldCard = `              <Link 
                href={concern.link}
                className={\`group relative overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 \${concern.bgClass} transition-all duration-500 rounded-sm hover:shadow-xl\`}
              >
                {/* Solid charcoal overlay for consistent text contrast */}
                <div className="absolute inset-0 bg-[#1A1A1A]/40 group-hover:bg-[#1A1A1A]/50 transition-colors duration-500"></div>
                {/* Gradient for extra pop at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-[#1A1A1A]/20 to-transparent"></div>`;

const newCard = `              <Link 
                href={concern.link}
                className={\`group relative overflow-hidden aspect-[4/3] flex flex-col justify-end p-8 transition-all duration-500 rounded-sm hover:shadow-xl\`}
              >
                <Image src={concern.image} alt={concern.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                {/* Solid charcoal overlay for consistent text contrast */}
                <div className="absolute inset-0 bg-[#1A1A1A]/30 group-hover:bg-[#1A1A1A]/40 transition-colors duration-500 z-10"></div>
                {/* Gradient for extra pop at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/30 to-transparent z-10"></div>`;

cg = cg.replace(oldCard, newCard);
cg = cg.replace('className="relative z-10 transition-transform', 'className="relative z-20 transition-transform');

fs.writeFileSync('src/components/home/ConcernGrid.tsx', cg);

// Update OurStory.tsx
let os = fs.readFileSync('src/components/home/OurStory.tsx', 'utf8');

if (!os.includes('import Image')) {
  os = os.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
}

const oldLeft = `<div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] bg-gradient-to-tr from-[#F1C9BD] to-[#F5EDE4] overflow-hidden">
             {/* Decorative element serving as placeholder for lifestyle image */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
               <div className="w-[150%] h-[150%] rounded-full border border-white/40 -translate-x-1/4 -translate-y-1/4"></div>
               <div className="absolute w-[100%] h-[100%] rounded-full border border-white/60 translate-x-1/4 translate-y-1/4"></div>
             </div>
             
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <span className="font-display text-4xl text-[#4D3D2D]/60 tracking-wider">Beauty in</span>
                <span className="font-display text-5xl text-[#4D3D2D]/80 tracking-wider italic mt-2">Simplicity</span>
             </div>
          </div>`;

const newLeft = `<div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[600px] overflow-hidden">
             <Image src="/images/our-story-lifestyle.jpg" alt="Alvora Skincare lifestyle" fill className="object-cover" />
          </div>`;

os = os.replace(oldLeft, newLeft);

fs.writeFileSync('src/components/home/OurStory.tsx', os);
console.log('Images wired up!');
