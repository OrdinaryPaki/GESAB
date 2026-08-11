import { placeholderImages } from "./placeholder-images";

const homeImageDimensions = { width: 1440, height: 960 };

export const homeImages = {
  why: [
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
  services: {
    badrumsrenovering: {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
    koksrenovering: {
      src: placeholderImages.content,
      alt: "",
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
    src: placeholderImages.content,
    alt: "",
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
