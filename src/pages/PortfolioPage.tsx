import { useEffect, useRef, useState } from 'react';
import { Package } from 'lucide-react';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/pageHero';

type ProductImage = {
  src: string;
  label: string; // strength, used for the switcher buttons
};

type ProductItem = {
  id: number;
  title: string;
  description: string;
  images: ProductImage[];
  /** 'cutout' = transparent pack shot floating on the card; 'photo' = full photo */
  imageStyle?: 'cutout' | 'photo';
};

const products: ProductItem[] = [
  {
    id: 1,
    title: 'Mellitofix Trio',
    description:
      'Mellitofix Trio is 3 in 1, once daily single pill combination that contains the benefits of 3 medications: empagliflozin, linagliptin, and metformin XR.',
    images: [
      { src: '/images/products/mellitofix-trio-25-5-1000.webp', label: '25/5/1000 mg' },
      { src: '/images/products/mellitofix-trio-10-5-1000.webp', label: '10/5/1000 mg' },
    ],
  },
  {
    id: 2,
    title: 'Mellitofix Met',
    description:
      'Mellitofix Met is a combination of empagliflozin and metformin hydrochloride indicated as an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus.',
    images: [
      { src: '/images/products/mellitofix-met-12.5-1000.webp', label: '12.5/1000 mg' },
      { src: '/images/products/mellitofix-met-12.5-500.webp', label: '12.5/500 mg' },
      { src: '/images/products/mellitofix-met-5-1000.webp', label: '5/1000 mg' },  
    ],
  },
  {
    id: 3,
    title: 'Thiotacid Liposomal',
    description:
      'Thiotacid Liposomal is the First Alpha Lipoic Acid with Liposomal Technology in the Egyptian Market with Enhanced Bioavailability, Extra Gastric Comfort & Better Patient Compliance.',
    images: [{ src: '/images/products/thiotacid_portfolio.webp', label: 'Thiotacid Liposomal' }],
    imageStyle: 'photo',
  },
];

export default function PortfolioPage() {
  return (
    <div>
      <PageHero
        icon={Package}
        title="Eva's Diabetes Portfolio"
        description="A curated selection of products supporting better diabetes care, from initiation to intensification."
      />

      <section className="container-max py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product, i) => (
            <Reveal
              key={product.id}
              direction={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}
              delay={(i % 3) * 100}
              className="h-full"
            >
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-ink-300 mx-auto mb-4" />
            <p className="text-ink-400">No products available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

/* Card with a gentle 3D tilt, a cursor-following gold light, and a strength switcher */
function ProductCard({ product, index }: { product: ProductItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = product.images.length;
  const isPhoto = product.imageStyle === 'photo';

  // Auto-cycle through strengths (pauses while hovered)
  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), 3500);
    return () => window.clearInterval(id);
  }, [count, paused]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    setPaused(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleLeave}
      className="h-full [perspective:1000px]"
    >
      <div className="spotlight card group h-full overflow-hidden flex flex-col transition-[transform,box-shadow,border-color] duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:shadow-lift hover:border-gold-300">
        {/* Visual */}
        <div className="aspect-[4/3] relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50">
          <span className="absolute top-4 left-4 z-20 font-serif italic text-sm text-gold-700 bg-white/80 backdrop-blur rounded-full px-3 py-1 border border-gold-200 shadow-soft">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* decorative rings behind the pack */}
          {!isPhoto && (
            <>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-[10px] border-sky-200/70 transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72">
                <div className="w-full h-full rounded-full border border-dashed border-gold-300/80 animate-spin-slower" />
              </div>
            </>
          )}

          {/* images (cross-fade between strengths) */}
          {product.images.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={`${product.title} ${img.label}`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                isPhoto
                  ? 'object-cover group-hover:scale-105'
                  : 'object-contain p-6 sm:p-8 drop-shadow-[0_18px_22px_rgba(61,58,51,0.28)] group-hover:-translate-y-1.5 group-hover:scale-[1.04]'
              } ${i === active ? 'opacity-100' : 'opacity-0 scale-95'}`}
            />
          ))}

          {!isPhoto && <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/70 to-transparent" />}

          {/* strength switcher */}
          {count > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-white/85 backdrop-blur border border-cream-300 shadow-soft">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${img.label}`}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-300 ${
                    i === active ? 'bg-ink-900 text-gold-300' : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="p-7 flex flex-col flex-1">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3 transition-colors duration-300 group-hover:text-gold-800">
            {product.title}
          </h3>
          <p className="text-sm text-ink-600 leading-relaxed flex-1">{product.description}</p>
          <div className="mt-6 h-px bg-cream-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-500 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
