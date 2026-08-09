import { placeholderImages } from "./placeholder-images";

const homeImageDimensions = { width: 1440, height: 960 };

export const homeImages = {
  why: [
    {
      src: "/images/home/why-waterproofing.webp",
      alt: "Tätskikt appliceras i ett badrum under renovering",
      ...homeImageDimensions,
    },
    {
      src: "/images/home/why-site-measurement.webp",
      alt: "Mått tas på en vägg inför badrumsrenovering",
      ...homeImageDimensions,
    },
  ],
  services: {
    badrumsrenovering: {
      src: "/images/home/service-bathroom-result.webp",
      alt: "Färdigrenoverat badrum med dusch och kommod",
      ...homeImageDimensions,
    },
    koksrenovering: {
      src: "/images/home/service-kitchen-result.webp",
      alt: "Färdigrenoverat kök med träfronter och matplats",
      ...homeImageDimensions,
    },
    totalentreprenad: {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
    rivningsarbeten: {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
  },
  about: {
    src: "/images/home/about-plumbing-detail.webp",
    alt: "Röranslutning justeras under ett handfat",
    ...homeImageDimensions,
  },
  gallery: [
    {
      src: "/images/home/gallery-bathroom-result.webp",
      alt: "Färdigt badrum med grönt kakel och dusch",
      ...homeImageDimensions,
    },
    {
      src: "/images/home/gallery-kitchen-result.webp",
      alt: "Färdigt kök med vita luckor och bänkskiva i trä",
      ...homeImageDimensions,
    },
    {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
    {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
    {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
  ],
};
