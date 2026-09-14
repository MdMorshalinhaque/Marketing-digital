import React from 'react';
import { Sparkles, Heart, ShieldCheck, Truck, Users, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative py-20 bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="AURA Lifestyle Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Heritage Meets Contemporary Fashion
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Crafted with Soul in Bangladesh
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            AURA Lifestyle was founded with a singular conviction: to reimagine modern Bangladeshi apparel by bridging ancient textile traditions like Jamdani, Khadi, and organic linen with contemporary streetwear silhouettes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Rooted in Dhaka, Designed for the World
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Started in a small design loft in Banani, Dhaka, AURA began as a rebellion against generic fast fashion. We noticed that Bangladeshi youth wanted modern cuts—oversized dropped shoulders, structured panjabis, textured linen shirts, and minimalist streetwear—crafted with the unmatched quality of local cotton mills.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every garment in our catalog is engineered for the tropical climate of Bengal, using breathable 240+ GSM combed cotton, European flax linen blends, and pre-shrunk mercerized fibers that endure season after season.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
              alt="Design studio in Dhaka"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pillars of Craft */}
      <section className="bg-stone-50 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h3 className="text-2xl font-extrabold text-stone-900">Our Core Principles</h3>
            <p className="text-xs sm:text-sm text-stone-500">
              How we uphold our promises to you and our artisan partners across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Artisanal Empowerment</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We work directly with traditional weavers in Tangail, Narayanganj, and Sirajganj, ensuring living wages and preserving endangered handloom motifs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Strict Quality Standard</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every single piece undergoes a 12-point quality inspection at our Banani central distribution hub before dispatching to your doorstep.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Nationwide Reliability</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our partnered courier network reaches all 64 districts in Bangladesh, complete with cash on delivery and easy 7-day doorstep size exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Experience the AURA Difference
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Explore our newest drop of premium tees, festive panjabis, linen coordinates, and accessories.
        </p>
        <button
          onClick={() => navigate({ type: 'shop' })}
          className="px-8 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition shadow-md"
        >
          Explore the Collection
        </button>
      </section>
    </div>
  );
};
