const fs = require('fs');
const path = require('path');

const ADMIN_SRC = 'D:/playbimboo-backend/play-bimboo/src/vite_pages/admin';
const APP_DIR = 'D:/playbimboo-backend/play-bimboo/src/app';

const pages = [
  { source: 'AdminLoginPage.tsx', dest: 'admin/login', component: 'AdminLoginPageClient', hasId: false },
  { source: 'AdminDashboardPage.tsx', dest: 'admin/(authenticated)', component: 'AdminDashboardPageClient', hasId: false },
  { source: 'AdminProductsPage.tsx', dest: 'admin/(authenticated)/products', component: 'AdminProductsPageClient', hasId: false },
  { source: 'AdminProductFormPage.tsx', dest: 'admin/(authenticated)/products/new', component: 'AdminProductFormPageClient', hasId: false },
  { source: 'AdminProductFormPage.tsx', dest: 'admin/(authenticated)/products/edit/[id]', component: 'AdminProductFormPageClient', hasId: true, isCopy: true },
  { source: 'AdminCategoriesPage.tsx', dest: 'admin/(authenticated)/categories', component: 'AdminCategoriesPageClient', hasId: false },
  { source: 'AdminGlobalAttributesPage.tsx', dest: 'admin/(authenticated)/attributes', component: 'AdminGlobalAttributesPageClient', hasId: false },
  { source: 'AdminOrdersPage.tsx', dest: 'admin/(authenticated)/orders', component: 'AdminOrdersPageClient', hasId: false },
  { source: 'AdminCustomersPage.tsx', dest: 'admin/(authenticated)/customers', component: 'AdminCustomersPageClient', hasId: false },
  { source: 'AdminReviewsPage.tsx', dest: 'admin/(authenticated)/reviews', component: 'AdminReviewsPageClient', hasId: false },
  { source: 'AdminContactMessages.tsx', dest: 'admin/(authenticated)/contact-messages', component: 'AdminContactMessagesClient', hasId: false },
  { source: 'AdminCouponsPage.tsx', dest: 'admin/(authenticated)/coupons', component: 'AdminCouponsPageClient', hasId: false },
  { source: 'AdminReportsPage.tsx', dest: 'admin/(authenticated)/reports', component: 'AdminReportsPageClient', hasId: false },
  { source: 'AdminSettingsPage.tsx', dest: 'admin/(authenticated)/settings', component: 'AdminSettingsPageClient', hasId: false },
  { source: 'AdminStoreAppearancePage.tsx', dest: 'admin/(authenticated)/store-appearance', component: 'AdminStoreAppearancePageClient', hasId: false },
];

function migratePage(pageInfo) {
  const sourcePath = path.join(ADMIN_SRC, pageInfo.source);
  if (!fs.existsSync(sourcePath)) {
    console.log('Skipping ' + pageInfo.source + ' - not found');
    return;
  }
  
  let content = fs.readFileSync(sourcePath, 'utf8');

  // Replace react-router-dom imports
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
    let navImports = [];
    if (imports.includes('useParams')) navImports.push('useParams');
    if (imports.includes('useNavigate')) navImports.push('useRouter');
    if (imports.includes('useLocation')) navImports.push('usePathname');
    
    let res = '';
    if (imports.includes('Link')) {
       res += 'import Link from "next/link";\n';
    }
    if (navImports.length > 0) {
       res += `import { ${navImports.join(', ')} } from "next/navigation";\n`;
    }
    return res;
  });

  // Convert hooks
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');
  content = content.replace(/useLocation\(\)/g, 'usePathname()');
  // Convert Links
  content = content.replace(/<Link([^>]*)to=/g, '<Link$1href=');
  // Remove SeoHead
  content = content.replace(/<SeoHead[^>]*\/>/g, '');
  content = content.replace(/import \{ SeoHead \} from '[^']+';/g, '');
  content = content.replace(/import \{ SeoHead \} from "[^"]+";/g, '');
  
  // Replace export name
  const originalExport = pageInfo.source.replace('.tsx', '');
  content = content.replace(new RegExp('export const ' + originalExport, 'g'), 'export const ' + pageInfo.component);

  // Add use client
  content = '"use client";\n' + content;

  // Fix relative imports (admin is 2 levels deep, Next.js dest is usually 3-4 levels deep)
  // Vite: src/vite_pages/admin -> src/services is ../../services
  // Next: src/app/admin/(authenticated)/products/new -> src/services is ../../../../../services
  const destDepth = pageInfo.dest.split('/').length; // e.g. admin/(authenticated) = 2
  // We need to figure out the depth relative to src/
  // src/app/admin = 2, src/app/admin/(authenticated) = 3
  const appToDestDepth = pageInfo.dest.split('/').length;
  // from dest to src is '../'.repeat(appToDestDepth + 1)  (since it's inside app/ folder)
  const relativePrefixToSrc = '../'.repeat(appToDestDepth + 1);
  
  // Replacing ../../ with relativePrefixToSrc
  content = content.replace(/from '..\/..\//g, `from '${relativePrefixToSrc}`);
  content = content.replace(/from "..\/..\//g, `from "${relativePrefixToSrc}`);

  const fullDestFolder = path.join(APP_DIR, pageInfo.dest);
  fs.mkdirSync(fullDestFolder, { recursive: true });

  fs.writeFileSync(path.join(fullDestFolder, pageInfo.component + '.tsx'), content);

  let serverPage = '';
  if (pageInfo.hasId) {
    serverPage = `import { ${pageInfo.component} } from './${pageInfo.component}';

export const metadata = {
  title: '${pageInfo.source.replace('.tsx', '')} | PlayBimboo Admin',
};

export default function Page({ params }: { params: { id: string } }) {
  return <${pageInfo.component} />;
}
`;
  } else {
    serverPage = `import { ${pageInfo.component} } from './${pageInfo.component}';

export const metadata = {
  title: '${pageInfo.source.replace('.tsx', '')} | PlayBimboo Admin',
};

export default function Page() {
  return <${pageInfo.component} />;
}
`;
  }
  fs.writeFileSync(path.join(fullDestFolder, 'page.tsx'), serverPage);
  
  if (!pageInfo.isCopy) {
    fs.unlinkSync(sourcePath);
  }
  console.log('Migrated ' + pageInfo.dest);
}

for (const p of pages) {
  migratePage(p);
}

// Migrate AdminLayout.tsx
const layoutSourcePath = path.join(ADMIN_SRC, 'AdminLayout.tsx');
if (fs.existsSync(layoutSourcePath)) {
  let layoutContent = fs.readFileSync(layoutSourcePath, 'utf8');
  layoutContent = layoutContent.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
    let navImports = [];
    if (imports.includes('useNavigate')) navImports.push('useRouter');
    if (imports.includes('useLocation')) navImports.push('usePathname');
    
    let res = '';
    if (imports.includes('Link')) {
       res += 'import Link from "next/link";\n';
    }
    if (navImports.length > 0) {
       res += `import { ${navImports.join(', ')} } from "next/navigation";\n`;
    }
    return res;
  });
  layoutContent = layoutContent.replace(/useNavigate\(\)/g, 'useRouter()');
  layoutContent = layoutContent.replace(/useLocation\(\)/g, 'usePathname()');
  layoutContent = layoutContent.replace(/<Link([^>]*)to=/g, '<Link$1href=');
  
  // Replace <Outlet /> with children
  layoutContent = layoutContent.replace(/<Outlet\s*\/>/g, '{children}');
  layoutContent = layoutContent.replace('export const AdminLayout: React.FC = () => {', 'export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {');
  
  // Add use client
  layoutContent = '"use client";\n' + layoutContent;
  
  // Fix imports
  layoutContent = layoutContent.replace(/from '..\/..\//g, "from '../../../../");
  layoutContent = layoutContent.replace(/from "..\/..\//g, "from \"../../../../");
  
  const layoutDestFolder = path.join(APP_DIR, 'admin/(authenticated)');
  fs.mkdirSync(layoutDestFolder, { recursive: true });
  fs.writeFileSync(path.join(layoutDestFolder, 'AdminLayoutClient.tsx'), layoutContent);
  
  // Create layout.tsx
  const serverLayout = `import { AdminLayout } from './AdminLayoutClient';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
`;
  fs.writeFileSync(path.join(layoutDestFolder, 'layout.tsx'), serverLayout);
  fs.unlinkSync(layoutSourcePath);
  console.log('Migrated AdminLayout');
}

console.log('Admin migration complete.');
