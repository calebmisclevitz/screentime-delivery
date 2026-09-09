import Image from "next/image";

const PROMOS = [
  {
    eyebrow: "Just in",
    title: "Fresh finds in Raleigh",
    className: "bg-primary text-lilac",
    images: ["/items/technics-sl1200.jpg", "/items/hollowbody-guitar.jpg"],
  },
  {
    eyebrow: "Price drops",
    title: "Markdowns near you",
    className: "bg-forest text-lime",
    images: ["/items/teak-credenza.jpg", "/items/walnut-speakers.jpg"],
  },
] as const;

export function PromoRail() {
  return (
    <div className="flex gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
      {PROMOS.map((promo) => (
        <article
          key={promo.eyebrow}
          className={`relative h-[136px] w-[287px] shrink-0 overflow-hidden rounded-xl shadow-brand ${promo.className}`}
        >
          <p className="absolute top-4 left-4 font-mono text-xs font-medium tracking-wider">
            {promo.eyebrow}
          </p>
          <p className="absolute bottom-4 left-4 w-[130px] font-heading text-2xl leading-[1.11] tracking-wide">
            {promo.title}
          </p>
          <div className="absolute top-1 right-1 h-32 w-[116px]">
            <Image
              src={promo.images[0]}
              alt=""
              width={90}
              height={110}
              className="absolute top-2 left-0 h-[95px] w-[77px] rotate-[15deg] object-cover"
            />
            <Image
              src={promo.images[1]}
              alt=""
              width={110}
              height={80}
              className="absolute top-0 left-8 h-[71px] w-[107px] rotate-[15deg] object-cover"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
