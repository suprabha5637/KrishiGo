import React from 'react';

interface PromoCardsRowProps {
  onSelectCategory?: (slug: string) => void;
}

export const PromoCardsRow: React.FC<PromoCardsRowProps> = ({ onSelectCategory }) => {
  const cards = [
    { id: 1, slug: 'fresh-vegetables', src: '/assets/ecommerce/promo_1.jpg', alt: 'FLAT 50% OFF Fresh Vegetables' },
    { id: 2, slug: 'fresh-fruits', src: '/assets/ecommerce/promo_2.jpg', alt: 'Up to 40% OFF Fruits & Dairy' },
    { id: 3, slug: 'grocery-staples', src: '/assets/ecommerce/promo_3.jpg', alt: 'Daily Essentials Lowest Prices' },
    { id: 4, slug: 'study-essentials', src: '/assets/ecommerce/promo_4.jpg', alt: 'Study Essentials For a Brighter Tomorrow' },
    { id: 5, slug: 'clothing-fashion', src: '/assets/ecommerce/promo_5.jpg', alt: 'Clothing & Fashion Stylish & Affordable' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onSelectCategory && onSelectCategory(card.slug)}
          className="relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <img 
            src={card.src} 
            alt={card.alt} 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
