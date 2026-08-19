const fs = require('fs');

const mockPath = 'src/data/mock/products.ts';
let content = fs.readFileSync(mockPath, 'utf8');

// Inject Ingredients and How to Use into the first few products.
content = content.replace(/safetyInfo:\s*'',/g, "safetyInfo: 'Apply 2-3 drops to clean, slightly damp skin. Gently press into face and neck until fully absorbed. Follow with moisturizer. Use morning and night.',");
content = content.replace(/specifications:\s*\{\},/g, "specifications: { 'Ingredients': 'Water, Niacinamide, Glycerin, Sodium Hyaluronate, Panthenol, Centella Asiatica Extract, Ceramide NP, Phenoxyethanol, Ethylhexylglycerin.' },");

fs.writeFileSync(mockPath, content);
console.log('mock updated');
