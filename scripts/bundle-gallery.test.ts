import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getBundleImages } from '../src/utils/bundleImages';

test('only explicitly configured bundle images appear, in order', () => {
  const bundle = { image: '/main.jpg', galleryImages: ['/cream.jpg', '/wash.jpg'], products: [{ images: ['/unrelated-product.jpg'] }] };
  assert.deepEqual(getBundleImages(bundle), ['/main.jpg', '/cream.jpg', '/wash.jpg']);
});
test('legacy bundles show only their thumbnail; missing images never use product/hero fallbacks', () => {
  const bundle = { image: '/main.jpg', products: [{ images: ['/random.jpg'] }] };
  assert.deepEqual(getBundleImages(bundle), ['/main.jpg']);
  assert.deepEqual(getBundleImages({ galleryImages: [] }), []);
});
test('all eight gallery images remain available and duplicates are removed', () => {
  const galleryImages = Array.from({ length: 8 }, (_, i) => `/gallery-${i}.jpg`);
  assert.equal(getBundleImages({ image: '/main.jpg', galleryImages }).length, 9);
  assert.deepEqual(getBundleImages({ image: '/main.jpg', galleryImages: ['/main.jpg', '/second.jpg'] }), ['/main.jpg', '/second.jpg']);
});
