const fs = require('fs');

const files = [
  'D:/playbimboo-backend/play-bimboo/src/app/admin/(authenticated)/AdminLayoutClient.tsx',
  'D:/playbimboo-backend/play-bimboo/src/app/admin/(authenticated)/products/AdminProductsPageClient.tsx',
  'D:/playbimboo-backend/play-bimboo/src/app/admin/(authenticated)/products/edit/[id]/AdminProductFormPageClient.tsx',
  'D:/playbimboo-backend/play-bimboo/src/app/admin/(authenticated)/products/new/AdminProductFormPageClient.tsx',
  'D:/playbimboo-backend/play-bimboo/src/app/admin/login/AdminLoginPageClient.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // replace the variable
  content = content.replace(/const navigate = useRouter\(\);/g, 'const router = useRouter();');
  
  // replace navigate with replace option
  content = content.replace(/navigate\(([^,]+),\s*\{\s*replace:\s*true\s*\}\)/g, 'router.replace($1)');
  
  // replace remaining navigate
  content = content.replace(/navigate\(/g, 'router.push(');
  
  fs.writeFileSync(file, content);
}
console.log('Fixed router navigation in Admin');
