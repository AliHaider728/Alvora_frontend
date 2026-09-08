'use server';
import { revalidatePath } from 'next/cache';

export async function revalidateProductPage(slug: string) {
  revalidatePath('/product/' + slug);
  revalidatePath('/product/' + slug, 'page');
}
