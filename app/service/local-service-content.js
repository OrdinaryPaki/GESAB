import { localServiceDecisions } from "./local-service-decisions";

const serviceCopy = {
  badrumsrenovering: {
    lead: "Vi hjälper dig att renovera badrummet från rivning till färdig yta, med samordning av yrkesroller och en tydlig offert.",
    preparation: "Bifoga gärna mått och bilder på ditt badrum. Berätta om dusch, WC eller golvbrunn ska flyttas och om du har ett annat badrum att använda under arbetet.",
    pricing: "Badrummets storlek, underlag, tätskikt och val av inredning påverkar kostnaden. Att flytta vatten eller avlopp förändrar också omfattningen. Vi går igenom förutsättningarna innan vi lämnar en offert för din badrumsrenovering.",
  },
  altanbygge: {
    lead: "Vi hjälper dig att bygga en altan eller ett trädäck med genomtänkt grundläggning, material och avslut.",
    preparation: "Skicka bilder av platsen och ungefärliga mått. Beskriv önskad höjd, trappa och räcke, så kan vi förbereda en genomgång av mark, infästning och utformning.",
    pricing: "Altanens yta, höjd, grundläggning och materialval påverkar priset. Trappor och räcken behöver också räknas med. Offerten utgår från den aktuella platsen och vad du vill att vi ska bygga.",
  },
  tvattstugsrenovering: {
    lead: "Vi hjälper dig att renovera tvättstugan till ett praktiskt rum med genomtänkta arbetsytor och rätt förutsättningar för vatten och avlopp.",
    preparation: "Berätta vilka maskiner som ska få plats, vad du behöver för förvaring och om rummet ligger i källaren. Bilder på golv, väggar och anslutningar hjälper oss inför genomgången.",
    pricing: "Underlagets skick, ytskikt, golvbrunn, el och rördragning avgör omfattningen. Vi går igenom vad som kan behållas och vad som behöver ändras innan du får ett prisförslag.",
  },
  koksrenovering: {
    lead: "Vi hjälper dig med köksrenovering från planering och rivning till ytskikt och montage, med en kontakt genom projektet.",
    preparation: "Skicka gärna köksritning och bilder. Ange om vatten, el eller planlösning ska ändras och vilka delar av köket du redan har valt eller beställt.",
    pricing: "Priset påverkas av rivning, material, montage och eventuella ändringar av el eller vatten. En full köksrenovering har en annan omfattning än enbart montering; vi tydliggör vad som ingår i din offert.",
  },
  koksmontering: {
    lead: "Vi hjälper dig att montera kökets skåp, luckor och inredning, med tydlig omfattning och noggranna avslut.",
    preparation: "Ha gärna köksritning, leveranslista och uppgifter om bänkskivan till hands. Berätta om det gamla köket är rivet och när det nya köket levereras.",
    pricing: "Antal skåp, passbitar, bänkskiva och underlag påverkar arbetstiden. Vi klargör även om rivning och samordning av el eller VVS ska ingå i uppdraget.",
  },
  snickeri: {
    lead: "Behöver du hjälp av en snickare? Vi arbetar med lister, foder, innerväggar och förvaring anpassad efter ditt hem.",
    preparation: "Beskriv vad du vill bygga eller ändra och bifoga gärna bilder, mått eller en enkel skiss. Ange också om ytorna ska vara färdiga för målning eller om fler moment behövs.",
    pricing: "Omfattning, material, anpassningar och ytfinish påverkar priset på snickeriarbetet. Vi går igenom delarna med dig och anger vad offerten omfattar.",
  },
  golvlaggning: {
    lead: "Vi hjälper dig med golvläggning och ett genomtänkt resultat från underlag till socklar, trösklar och övergångar.",
    preparation: "Ange ungefärlig golvyta, önskat material och vilket golv som ligger där idag. Berätta om bostaden är möblerad och om flera rum ska läggas samtidigt.",
    pricing: "Golvtyp, rummens form, rivning och behov av underarbete påverkar kostnaden. Vi undersöker vad som behöver göras med underlaget innan vi kan lämna ett genomarbetat pris.",
  },
  totalentreprenad: {
    lead: "Vi hjälper dig att samordna en större renovering med ett samlat upplägg för planering, yrkesroller och genomförande.",
    preparation: "Lista vilka rum som berörs, vad du vill behålla och om du behöver bo kvar under arbetet. Ritningar och bilder hjälper oss att diskutera omfattning och ordningsföljd.",
    pricing: "En totalrenovering behöver avgränsas innan den kan prissättas. Bostadens skick, materialval och ändringar av planlösning eller installationer påverkar både kostnad och tidplan.",
  },
  rivningsarbeten: {
    lead: "Vi hjälper dig med kontrollerad rivning inför nästa steg i renoveringen, med tydlig avgränsning och planering av bortforsling.",
    preparation: "Beskriv vad som ska rivas och vad som ska sparas. Bifoga bilder och eventuella ritningar, särskilt om väggar eller installationer berörs.",
    pricing: "Material, åtkomst, skydd av omgivande ytor och avfallshantering påverkar priset. Bärighet och installationer behöver klarläggas innan rivning som berör dem kan påbörjas.",
  },
};

export function createLocalServiceDetail(service, detail, area) {
  const copy = serviceCopy[service.slug];
  const editorial = localServiceDecisions[service.slug];
  const title = `${editorial.searchName} i ${area.name}`;
  return {
    ...detail,
    heroTitle: title,
    quoteBenefits: ["Tydlig omfattning i offerten", "Planering utifrån ditt projekt", "Kontakt med GESAB från första förfrågan"],
    process: detail.process.map(([heading, body], index) => index === 0 ? [
      "Första genomgången",
      "Vi går igenom dina önskemål och underlag. Om ett platsbesök behövs stämmer vi av upplägg och villkor innan det bokas.",
    ] : [heading, body]),
    heroLead: `${copy.lead} Vi tar uppdrag i ${area.name}.`,
    heroImageAlt: `${service.title} – inspiration inför ditt projekt`,
    quoteHeading: `Få offert i ${area.name}`,
    quoteDescription: `Beskriv ditt projekt inom ${service.title.toLocaleLowerCase("sv-SE")} och ange adress i ${area.name}. Vi återkommer om omfattning och nästa steg.`,
    localDecisions: editorial.sections,
    introTitle: editorial.topic,
    intro: copy.lead,
    considerationsIntro: copy.pricing,
    preparationIntro: copy.preparation,
    localDescription: `${title}. ${editorial.description}`,
    reviewsTitle: "Kundomdömen om GESAB",
    faq: [
      { question: `Vad kostar ${service.title.toLocaleLowerCase("sv-SE")} i ${area.name}?`, answer: copy.pricing },
      { question: `Hur planerar ni mitt uppdrag i ${area.name}?`, answer: "Ange adress, önskad start och vilka delar du behöver hjälp med. Vi stämmer av omfattning, tillgänglighet och hur en eventuell genomgång på plats ska ordnas. Eventuella kostnader för besök eller resor behöver klargöras innan ni bokar." },
      ...detail.faq.filter(({ question }) => !/kostar|pris|områden|Göteborg|bygglov/i.test(question)),
    ],
  };
}
