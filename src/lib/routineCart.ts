import type { CartItem, Product, RoutineComponent } from '../types';
import { calculateRoutineDiscount, type RoutineDiscountSettings } from './routineDiscount';

export function createRoutineCartItem(components: RoutineComponent[], settings?: RoutineDiscountSettings, id = `routine-${crypto.randomUUID()}`): CartItem {
  if (!components.length || components.some(c => !c.productId || !Number.isInteger(c.quantity) || c.quantity < 1)) throw new Error('Choose valid routine products.');
  const totals = calculateRoutineDiscount(components, settings);
  const product = {
    id, name: `Custom Routine (${totals.totalQuantity} items)`, slug: 'build', productType: 'bundle',
    price: totals.total, originalPrice: totals.subtotal, images: [components[0].image].filter(Boolean),
    inStock: true, trackInventory: false, status: 'published', isVisible: true,
    shortDescription: 'Your personalised skincare routine',
  } as Product;
  return { product, quantity: 1, isRoutine: true, routineComponents: components.map(c => ({ ...c })), routineDiscountPercent: totals.percent, resolvedUnitPrice: totals.total };
}
