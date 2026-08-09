const fs = require("fs");
const path = require("path");

function migratePage(sourceName, destFolder, clientName, dynamicParam) {
  const sourcePath = path.join("D:/playbimboo-backend/play-bimboo/src/vite_pages/storefront", sourceName);
  if (!fs.existsSync(sourcePath)) {
    console.log("Skipping " + sourceName + " as it does not exist");
    return;
  }
  let content = fs.readFileSync(sourcePath, "utf8");

  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+[\x27\x22]react-router-dom[\x27\x22];?/g, (match, imports) => {
    let nextImports = [];
    let navImports = [];
    
    if (imports.includes("Link")) nextImports.push("Link from \x22next/link\x22");
    if (imports.includes("useParams")) navImports.push("useParams");
    if (imports.includes("useNavigate")) navImports.push("useRouter");
    if (imports.includes("useLocation")) navImports.push("usePathname");
    
    let res = "";
    if (imports.includes("Link")) {
       res += "import Link from \x22next/link\x22;\n";
    }
    if (navImports.length > 0) {
       res += `import { ${navImports.join(", ")} } from "next/navigation";\n`;
    }
    return res;
  });

  content = content.replace(/useNavigate\(\)/g, "useRouter()");
  content = content.replace(/useLocation\(\)/g, "usePathname()");
  content = content.replace(new RegExp("export const " + sourceName.replace(".tsx", ""), "g"), "export const " + clientName);

  content = "\"use client\";\n" + content;

  const fullDestFolder = path.join("D:/playbimboo-backend/play-bimboo/src/app", destFolder);
  fs.mkdirSync(fullDestFolder, { recursive: true });

  fs.writeFileSync(path.join(fullDestFolder, clientName + ".tsx"), content);

  let serverPage = "";
  if (dynamicParam) {
    serverPage = `import { ${clientName} } from "./${clientName}";

export async function generateMetadata({ params }: { params: Promise<{ ${dynamicParam}: string }> }) {
  const slug = (await params).${dynamicParam};
  return {
    title: \`\${slug} | PlayBimboo\`,
  };
}

export default async function Page({ params }: { params: Promise<{ ${dynamicParam}: string }> }) {
  return <${clientName} />;
}
`;
  } else {
    serverPage = `import { ${clientName} } from "./${clientName}";

export const metadata = {
  title: "Checkout | PlayBimboo",
};

export default function Page() {
  return <${clientName} />;
}
`;
  }
  fs.writeFileSync(path.join(fullDestFolder, "page.tsx"), serverPage);
  fs.unlinkSync(sourcePath);
  console.log("Migrated " + sourceName);
}

migratePage("CategoryPage.tsx", "category/[slug]", "CategoryPageClient", "slug");
migratePage("ProductDetailPage.tsx", "product/[slug]", "ProductDetailPageClient", "slug");
migratePage("CheckoutPage.tsx", "checkout", "CheckoutPageClient", null);

const catPage = `import { redirect } from "next/navigation";
export default function CategoryIndex() {
  redirect("/category/all");
}
`;
fs.mkdirSync("D:/playbimboo-backend/play-bimboo/src/app/category", { recursive: true });
fs.writeFileSync("D:/playbimboo-backend/play-bimboo/src/app/category/page.tsx", catPage);

console.log("Migration scripts executed successfully.");
