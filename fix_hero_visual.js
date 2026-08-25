const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');

const targetRegex = /\{\/\* RIGHT VISUAL \*\/\}[\s\S]*?\{\/\* BADGE \*\/\}/;
const match = c.match(targetRegex);

if (match) {
  const newVisual = `{/* RIGHT VISUAL */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 25 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative min-h-[470px] lg:min-h-[690px] w-full"
          >
            {/* Peach visual background with organic sweeping curve */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-[115%] bg-[#EFCDBE] rounded-l-none lg:rounded-l-[150px] xl:rounded-l-[250px] -z-0" />

            {/* Soft light */}
            <div className="absolute right-[5%] top-[8%] z-[1] h-[55%] w-[70%] rounded-full bg-white/25 blur-3xl" />

            {/* PRODUCT IMAGE */}
            <div className="absolute inset-0 z-10 lg:-left-[15%]">
              <Image
                src="/images/hero/alvora-hero.png"
                alt="ALVORA skincare products"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover object-bottom lg:object-[center_bottom]"
              />
            </div>

            {/* BADGE */}`;
            
  c = c.replace(targetRegex, newVisual);
  fs.writeFileSync('src/components/home/HeroSection.tsx', c);
  console.log('Hero section visual replaced successfully.');
} else {
  console.log('Could not find target block in HeroSection.tsx');
}
