// AI-generated bathroom concepts selected by the owner: 1, 2, 4, 5, 7 and 10.
// Keep service and inspiration-gallery imagery in the same selected order.
const selectedImages = [
  {
    src: "/images/services/badrumsrenovering/01-ljust-villabadrum.webp",
    smallSrc: "/images/services/badrumsrenovering/01-ljust-villabadrum-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/01-ljust-villabadrum-320.webp",
    title: "Ljust och rymligt villabadrum",
    alt: "Rymligt badrum med dubbelkommod i ek, duschvägg och inbyggt badkar",
    caption: "Ljusa stenfärgade ytor, ek och gott om plats för både dusch och badkar.",
  },
  {
    src: "/images/services/badrumsrenovering/02-klassiskt-badrum.webp",
    smallSrc: "/images/services/badrumsrenovering/02-klassiskt-badrum-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/02-klassiskt-badrum-320.webp",
    title: "Klassiskt badrum med högt fönster",
    alt: "Klassiskt badrum med mörkblå kommod, vitt kakel, badkar och mässingsdetaljer",
    caption: "Vitt kakel, mörkblå kommod och mässingsdetaljer i ett rum med högt fönster.",
  },
  {
    src: "/images/services/badrumsrenovering/04-gront-kakel-ek.webp",
    smallSrc: "/images/services/badrumsrenovering/04-gront-kakel-ek-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/04-gront-kakel-ek-320.webp",
    title: "Grönt kakel och varm ek",
    alt: "Badrum med grönt kakel, ekkommod, ljust klinkergolv och duschvägg i glas",
    caption: "Grönt kakel möter varm ek och ett ljust golv i en luftig planlösning.",
  },
  {
    src: "/images/services/badrumsrenovering/05-badrum-snedtak.webp",
    smallSrc: "/images/services/badrumsrenovering/05-badrum-snedtak-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/05-badrum-snedtak-320.webp",
    title: "Badrum under snedtak",
    alt: "Ljust badrum under snedtak med två takfönster, inbyggt badkar och separat dusch",
    caption: "Takfönster ger dagsljus över badkaret, medan duschen får plats där takhöjden är som störst.",
  },
  {
    src: "/images/services/badrumsrenovering/07-badkar-fonster.webp",
    smallSrc: "/images/services/badrumsrenovering/07-badkar-fonster-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/07-badkar-fonster-320.webp",
    title: "Badkar vid fönstret",
    alt: "Rymligt badrum med fristående badkar vid ett brett fönster och dubbelkommod i ek",
    caption: "Fristående badkar, bred dubbelkommod och naturligt ljus från trädgårdssidan.",
  },
  {
    src: "/images/services/badrumsrenovering/10-tidlost-familjebadrum.webp",
    smallSrc: "/images/services/badrumsrenovering/10-tidlost-familjebadrum-768.webp",
    thumbnailSrc: "/images/services/badrumsrenovering/10-tidlost-familjebadrum-320.webp",
    title: "Tidlöst familjebadrum",
    alt: "Familjebadrum med vitt kakel, grå dubbelkommod, inbyggt badkar och separat dusch",
    caption: "Vitt kakel och grå inredning med plats för två handfat, badkar och separat dusch.",
  },
];

export const bathroomImages = selectedImages.map((image) => ({
  ...image,
  width: 1440,
  height: 1080,
  srcSet: `${image.thumbnailSrc} 320w, ${image.smallSrc} 768w, ${image.src} 1440w`,
}));
