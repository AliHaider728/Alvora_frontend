const { getImageProps } = require('next/image');

const common = { alt: 'Alvora', sizes: '100vw', priority: true, fill: true };
const { props: { srcSet, ...rest } } = getImageProps({ ...common, src: '/images/alvora-desktop-hero.webp' });
console.log(JSON.stringify(rest, null, 2));
