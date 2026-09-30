import type { Ref } from 'react';

const line = 'alvora-skeleton rounded-lg';

function ProductShape({ mobile = false }: { mobile?: boolean }) {
  return (
    <div aria-hidden="true" className={`ritual-skeleton-bubble relative flex aspect-square items-center justify-center rounded-full ${mobile ? 'w-full max-w-[280px]' : 'w-[46vw] max-w-[560px]'}`}>
      <div className="absolute inset-[12%] rounded-full border border-white/60" />
      <div className="relative flex h-[66%] w-[27%] flex-col items-center drop-shadow-[0_20px_20px_rgba(122,68,48,0.1)]">
        <div className={`h-[13%] w-[42%] rounded-t-md bg-[#E8D4C9] ${line}`} />
        <div className={`h-[12%] w-[62%] rounded-t-lg bg-[#E8D4C9] ${line}`} />
        <div className={`relative h-[75%] w-full rounded-[18%_18%_12%_12%] bg-[#F7EDE6] ${line}`}>
          <div className="absolute inset-x-[18%] top-[38%] h-[24%] rounded-md bg-white/60" />
        </div>
      </div>
      {!mobile && <div className="absolute right-[8%] top-1/2 flex -translate-y-1/2 flex-col gap-4">
        <div className={`h-14 w-14 rounded-full border border-white/70 ${line}`} />
        <div className={`h-14 w-14 rounded-full border border-white/70 ${line}`} />
      </div>}
    </div>
  );
}

function StepText({ mobile = false }: { mobile?: boolean }) {
  return (
    <div aria-hidden="true" className={mobile ? 'flex w-full flex-col items-center' : 'flex w-full max-w-md items-start gap-5'}>
      {!mobile && <span className="font-display text-6xl italic leading-none text-[#C87355]/50">01</span>}
      <div className={mobile ? 'flex w-full flex-col items-center' : 'w-full space-y-4'}>
        <div className={`${line} h-4 w-24 ${mobile ? 'mb-3' : ''}`} />
        <div className={`${line} h-9 ${mobile ? 'w-52' : 'w-4/5'}`} />
        <div className={`${line} mt-3 h-4 ${mobile ? 'w-64 max-w-full' : 'w-full'}`} />
        <div className={`${line} mt-2 h-4 ${mobile ? 'w-52' : 'w-5/6'}`} />
        {mobile && <div className="mt-6 flex w-full justify-center gap-3">
          <div className={`${line} h-12 w-32 rounded-full`} />
          <div className={`${line} h-12 w-28 rounded-full`} />
        </div>}
      </div>
    </div>
  );
}

export function BestSellersRitualSkeleton({ sectionRef }: { sectionRef?: Ref<HTMLElement> }) {
  return (
    <>
      <section role="status" aria-label="Loading best seller ritual" className="bg-[#FAF6F2] px-6 py-20 md:hidden">
        <div className="mx-auto flex max-w-md flex-col gap-16">
          <div className="text-center">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-[#C87355]">Your Daily Ritual</span>
            <h2 className="font-display text-4xl text-[#1A1A1A]">Curated Routine</h2>
          </div>
          {[0, 1, 2].map(index => <div key={index} className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-full max-w-[280px]">
              <ProductShape mobile />
              <span aria-hidden="true" className="absolute -left-2 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C87355]/60 font-display text-2xl italic text-white">{index + 1}</span>
            </div>
            <StepText mobile />
          </div>)}
        </div>
      </section>
      <section id="ritual" ref={sectionRef} role="status" aria-label="Loading best seller ritual" className="relative hidden h-[800vh] bg-[#FAF6F2] md:block">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute right-[15%] top-1/2 w-[44%] max-w-md -translate-y-1/2 px-10">
            <StepText />
          </div>
          <div className="absolute left-[9%] flex items-center justify-center lg:left-[12%]">
            <ProductShape />
          </div>
        </div>
      </section>
    </>
  );
}
