// Buyer questions belong to the service; local pages reuse these facts without inventing local jobs.
export const localServiceDecisions = {
  badrumsrenovering: {
    searchName: "Badrumsrenovering", topic: "Renovera badrum med rätt omfattning",
    description: "Renovera badrum med planering, rivning, tätskikt och montering. Läs om pris, förberedelser och begär offert.",
    sections: [
      ["Behålla eller flytta inredningen?", "Börja med att skilja på nya ytskikt och en ny planlösning. En flytt av dusch, WC eller golvbrunn kan kräva mer arbete med underlag och rör än att behålla placeringen. Skicka både dagens planlösning och dina önskemål när du ber om offert."],
      ["Jämför vad badrumsofferten omfattar", "Be om en tydlig uppdelning av rivning, underarbete, tätskikt, plattsättning, installationer och inredning. Kontrollera vem som köper material och hur eventuella skador som upptäcks efter rivning ska hanteras."],
    ],
  },
  altanbygge: {
    searchName: "Bygga altan", topic: "Planera altanbygge och trädäck",
    description: "Altanbygge och trädäck anpassat efter din tomt. Läs om material, grundläggning, pris och förberedelser inför offert.",
    sections: [
      ["Utgå från användningen och marken", "Mät upp plats för möbler och passage innan du bestämmer altanens storlek. Höjd mot dörren, marknivåer och utrymme för trappor behöver fungera tillsammans. En bild av fasaden och marken ger bättre underlag än enbart antal kvadratmeter."],
      ["Räkna med hela altanen", "När du jämför offerter behöver grundläggning, stomme, trall, räcken och trappor framgå. Berätta om en gammal altan ska tas bort och hur material kan transporteras till byggplatsen. Materialvalet bör även passa hur mycket underhåll du vill göra."],
    ],
  },
  tvattstugsrenovering: {
    searchName: "Tvättstugsrenovering", topic: "Renovera tvättstugan efter vardagens behov",
    description: "Renovera tvättstuga med plats för maskiner, förvaring och arbetsytor. Läs om underlag, pris och planering inför offert.",
    sections: [
      ["Planera maskiner och arbetsytor tillsammans", "Utgå från maskinernas mått och hur dörrarna öppnas. Arbetsbänk, tvättho och förvaring behöver lämna plats för användning och service. Berätta om maskinerna ska stå kvar eller byta plats, eftersom det påverkar anslutningarna."],
      ["Undersök rummet före materialvalet", "Golv, väggar och befintlig golvbrunn behöver bedömas innan utförandet bestäms. I en källare är även underlagets fuktförhållanden viktiga. Gör därför inte materialbeställningen till det första steget; börja med rummets förutsättningar."],
    ],
  },
  koksrenovering: {
    searchName: "Köksrenovering", topic: "Renovera köket från planlösning till montage",
    description: "Köksrenovering med rivning, ytskikt och montage. Planera omfattning, installationer och pris och begär offert för ditt kök.",
    sections: [
      ["Nytt kök eller en större ombyggnad?", "Att ersätta köket på samma plats skiljer sig från att flytta diskho, ventilation eller väggar. Markera vad som ska ändras på ritningen. Då kan renoveringens förberedande moment planeras innan skåpen monteras."],
      ["Samordna leveranserna med underarbetet", "Köksritning, mått på vitvaror och uppgifter om bänkskivan behövs för att undvika missade anslutningar. Klargör vem som ansvarar för beställning och leverans. Om rummet redan är färdigt och du enbart behöver montage kan köksmontering vara rätt tjänst."],
    ],
  },
  koksmontering: {
    searchName: "Köksmontering", topic: "Montera kök i ett förberett rum",
    description: "Hjälp med köksmontering, skåp, luckor och passbitar. Se vad som behöver vara förberett och begär en offert för montaget.",
    sections: [
      ["Kontrollera ritning och leveranslista", "Montaget behöver stämma med rummets mått och det levererade köket. Ha ritning, skåpförteckning och uppgifter om bänkskiva till hands. Upplys om saknade delar eller ändringar från den ursprungliga beställningen innan arbetet planeras."],
      ["Avgränsa montage från andra arbeten", "Skåpmontage innebär inte automatiskt att rivning, golv, målning eller inkoppling av el och vatten ingår. Beskriv rummets nuvarande skick och få dessa moment avstämda i offerten. Behöver hela rummet göras om, läs även om köksrenovering."],
    ],
  },
  golvlaggning: {
    searchName: "Golvläggare", topic: "Golvläggning med genomtänkta underlag och avslut",
    description: "Hjälp med golvläggning, underarbete, socklar och trösklar. Läs vad som påverkar priset och begär offert för ditt golv.",
    sections: [
      ["Golvtypen är bara en del av valet", "Ett nytt golv behöver passa underlaget och rummets användning. Berätta vilket golv som ligger där i dag, om det finns golvvärme och vilket material du överväger. Förutsättningarna avgör vilket underarbete som behöver ingå."],
      ["Ta med övergångar och möblering", "Dörröppningar, nivåskillnader och socklar påverkar det färdiga resultatet. Ange vilka rum som ska läggas och om möbler behöver flyttas i etapper. En offert för enbart läggning är inte direkt jämförbar med en som även omfattar rivning och avslut."],
    ],
  },
  snickeri: {
    searchName: "Snickare", topic: "Snickeriarbeten anpassade efter hemmet",
    description: "Snickeri med lister, dörrfoder, innerväggar och förvaring. Beskriv ditt projekt och få offert med tydlig omfattning.",
    sections: [
      ["Beskriv funktionen och slutresultatet", "Förvaring, en ny innervägg och byte av lister ställer olika krav på mått och material. Visa gärna vad som finns i dag och hur du vill använda den färdiga lösningen. En enkel skiss räcker som utgångspunkt för samtalet."],
      ["Bestäm var snickeriet slutar", "Ska arbetet lämnas färdigt för målning eller ingår fler moment? Anslutningar mot golv, tak och befintliga dörrar behöver också räknas med. Samla gärna flera mindre snickeriarbeten i samma beskrivning så att uppdraget kan avgränsas tydligt."],
    ],
  },
  totalentreprenad: {
    searchName: "Totalentreprenad", topic: "Planera en sammanhållen totalrenovering",
    description: "Samordnad renovering med tydlig omfattning och arbetsordning. Läs om planering och offert för totalentreprenad.",
    sections: [
      ["Definiera helheten innan detaljerna", "Lista rummen som berörs och skilj sådant som måste göras från önskemål som kan väljas till. Ange om ni ska bo kvar och vilka funktioner som måste fungera under tiden. Det ger ett bättre underlag för etapper och prioriteringar."],
      ["Gör ansvar och ändringar tydliga", "Offerten behöver visa vilka arbeten, material och projekteringsmoment som ingår samt vem som ansvarar för dem. Bestäm också hur tillval och oförutsedda förhållanden godkänns. Begreppet totalentreprenad ersätter inte en tydlig överenskommelse om det aktuella projektet."],
    ],
  },
  rivningsarbeten: {
    searchName: "Rivningsarbeten", topic: "Avgränsa rivningen inför renoveringen",
    description: "Rivning inför renovering med planering av skydd, åtkomst och avfall. Beskriv vad som ska tas bort och begär offert.",
    sections: [
      ["Markera både det som rivs och det som sparas", "Bilder och ritningar hjälper till att avgränsa väggar, inredning och ytskikt. Berätta vilka angränsande rum som används under arbetet. Bärighet och ledningar behöver vara klarlagda innan berörda delar rivs."],
      ["Planera skydd och bortforsling", "Transportväg, trappor och möjlighet att ställa avfall påverkar upplägget. Specificera om bortforsling och förberedelse för nästa yrkesgrupp ska ingå. Om materialens innehåll är okänt behöver det undersökas före rivning, så att rätt hantering kan planeras."],
    ],
  },
};
