import { placeholderImages } from "./placeholder-images";

const homeImageDimensions = { width: 1440, height: 960 };
const serviceImageDimensions = { width: 1440, height: 1080 };
const galleryImageDimensions = { width: 1440, height: 1080 };
const portraitImageDimensions = { width: 1120, height: 1400 };

export const homeImages = {
  why: [
    {
      src: "/images/home/why-team-planning.webp",
      alt: "Två hantverkare planerar arbetet tillsammans utifrån en ritning",
      ...portraitImageDimensions,
    },
    {
      src: "/images/home/why-final-inspection.webp",
      alt: "Hantverkare slutkontrollerar ett färdigrenoverat badrum",
      ...portraitImageDimensions,
    },
  ],
  services: {
    badrumsrenovering: {
      src: "/images/home/service-bathroom-warm.webp",
      alt: "Färdigrenoverat badrum med varm beige sten och kommod i ek",
      ...serviceImageDimensions,
    },
    altanbygge: {
      src: "/images/home/service-altan.png",
      alt: "Nybyggd altan i trä med räcke och uteplats",
      ...serviceImageDimensions,
    },
    tvattstugsrenovering: {
      src: "/images/home/service-laundry-compact.webp",
      alt: "Färdigrenoverad kompakt tvättstuga med arbetsbänk och förvaring",
      ...serviceImageDimensions,
    },
    koksrenovering: {
      src: "/images/home/service-kitchen-warm.webp",
      alt: "Färdigrenoverat varmt kök med grå skåp och arbetsbänk i trä",
      ...serviceImageDimensions,
    },
    totalentreprenad: {
      src: "/images/services/totalentreprenad/totalentreprenad-01-kok-vardagsrum.webp",
      alt: "Färdig samordnad renovering med kök och vardagsrum",
      ...serviceImageDimensions,
    },
    rivningsarbeten: {
      src: placeholderImages.content,
      alt: "",
      ...homeImageDimensions,
    },
  },
  about: {
    src: "/images/home/about-team-workshop.webp",
    alt: "Två hantverkare planerar material tillsammans i verkstaden",
    ...portraitImageDimensions,
  },
  gallery: [
    {
      src: "/images/home/gallery-bathroom-green.webp",
      alt: "Färdigrenoverat badrum med grönt kakel och dusch",
      ...galleryImageDimensions,
    },
    {
      src: "/images/home/gallery-kitchen-island.webp",
      alt: "Färdigrenoverat kök med köksö och varma trädetaljer",
      ...galleryImageDimensions,
    },
    {
      src: "/images/home/gallery-built-in-storage.webp",
      alt: "Platsbyggd bokhylla och förvaring i vardagsrum",
      ...galleryImageDimensions,
    },
    {
      src: "/images/home/gallery-shower-blue-grey.webp",
      alt: "Färdig dusch med blågrått kakel och inbyggd hylla",
      ...galleryImageDimensions,
    },
    {
      src: "/images/home/gallery-whole-home.webp",
      alt: "Samordnad renovering med nytt kök och vardagsrum",
      ...galleryImageDimensions,
    },
  ],
};
