const fs = require('fs');

const path = 'D:/playbimboo-backend/play-bimboo/src/app/category/[slug]/CategoryPageClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  'import { useParams } from "next/navigation";',
  'import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";'
);

// 2. Replace useSearchParams destructured
content = content.replace(
  'const [searchParams, setSearchParams] = useSearchParams();',
  `const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = (newParams: URLSearchParams, options?: { replace?: boolean }) => {
    const search = newParams.toString();
    const query = search ? '?' + search : '';
    if (options?.replace) {
      router.replace(pathname + query, { scroll: false });
    } else {
      router.push(pathname + query, { scroll: false });
    }
  };`
);

fs.writeFileSync(path, content);
console.log('Fixed CategoryPageClient.tsx');
