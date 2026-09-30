import { api } from '../services/api';

export async function getCatalogPageData() {
  const [products, bundleResult, categories] = await Promise.all([
    api.getProducts({ isVisible: true }),
    api.getBundles(),
    api.getCategories(),
  ]);

  return {
    initialProducts: Array.isArray(products) ? products : [],
    initialBundles: Array.isArray(bundleResult) ? bundleResult : bundleResult?.bundles || [],
    initialCategories: Array.isArray(categories) ? categories : [],
  };
}
