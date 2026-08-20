const fs = require('fs');

let content = fs.readFileSync('src/components/home/Testimonials.tsx', 'utf8');

// Remove motion stuff to ensure visibility
content = content.replace(/variants=\{contVariants\}/g, '');
content = content.replace(/initial="hidden"/g, '');
content = content.replace(/whileInView="visible"/g, '');
content = content.replace(/viewport=\{\{ once: true, margin: "-50px" \}\}/g, '');
content = content.replace(/variants=\{animVariants\}/g, '');

content = content.replace(/<motion\.div/g, '<div');
content = content.replace(/<\/motion\.div>/g, '</div>');

fs.writeFileSync('src/components/home/Testimonials.tsx', content);
console.log('Testimonials fixed');
