import Image from "next/image";

const PROMOS = [
  {
    title: "new furniture in your area",
    action: "Explore",
    className: "bg-primary text-primary-foreground",
    buttonClass: "bg-background text-primary",
    image: "/items/rattan-lounge-chair.jpg",
  },
  {
    title: "popular items",
    action: "Discover now",
    className: "bg-olive text-sprout",
    buttonClass: "bg-sprout text-olive",
    image: "/items/technics-sl1200.jpg",
  },
] as const;

export function PromoRail() {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
      {PROMOS.map((promo) => (
        <article
          key={promo.title}
          className={`relative h-[155px] w-[287px] shrink-0 overflow-hidden rounded-3xl ${promo.className}`}
        >
          <p className="absolute top-2.5 left-4 w-[150px] font-display text-[32px] leading-none">
            {promo.title}
          </p>
          <span
            className={`absolute bottom-4 left-4 flex h-[31px] items-center rounded-full px-4 text-sm font-medium ${promo.buttonClass}`}
          >
            {promo.action}
          </span>
          <Image
            src={promo.image}
            alt=""
            width={132}
            height={156}
            className="absolute top-8 -right-2 h-[156px] w-[132px] object-cover"
          />
        </article>
      ))}
    </div>
  );
}
