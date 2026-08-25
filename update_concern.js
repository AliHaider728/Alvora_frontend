const fs = require('fs');

let content = fs.readFileSync('src/components/home/ConcernGrid.tsx', 'utf8');

// Update concerns array
const oldConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-gradient-to-br from-[#8DB4D2] to-[#B0CEDB]'
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-gradient-to-br from-[#E1A492] to-[#F1C9BD]'
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-gradient-to-br from-[#9CBF86] to-[#CDE2BA]'
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-gradient-to-br from-[#EADED2] to-[#F5EDE4]'
    }
  ];`;

const newConcerns = `  const concerns = [
    {
      id: 'hydration',
      name: 'Hydration',
      link: '/category/all?tags=hydrating',
      bgClass: 'bg-[#8C989C]' // A muted cool-warm tone
    },
    {
      id: 'brightening',
      name: 'Brightening',
      link: '/category/all?tags=brightening',
      bgClass: 'bg-[#D9A092]' // Soft terracotta
    },
    {
      id: 'acne',
      name: 'Acne & Blemishes',
      link: '/category/all?tags=acne',
      bgClass: 'bg-[#7A7D75]' // Muted sage/charcoal
    },
    {
      id: 'barrier',
      name: 'Skin Barrier',
      link: '/category/all?tags=barrier',
      bgClass: 'bg-[#EADED2]' // Warm beige
    }
  ];`;

content = content.replace(oldConcerns, newConcerns);

// Update overlay
const oldOverlay = `{/* Gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>`;

const newOverlay = `{/* Solid charcoal overlay for consistent text contrast */}
                <div className="absolute inset-0 bg-[#1A1A1A]/40 group-hover:bg-[#1A1A1A]/50 transition-colors duration-500"></div>
                {/* Gradient for extra pop at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-[#1A1A1A]/20 to-transparent"></div>`;

content = content.replace(oldOverlay, newOverlay);

fs.writeFileSync('src/components/home/ConcernGrid.tsx', content);
console.log('ConcernGrid updated!');
