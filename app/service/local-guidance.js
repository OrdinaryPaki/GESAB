// Official municipal guidance checked 2026-09-08. Link to current rules; do not promise permit eligibility.
const guidance = {
  boras: {
    alteration: {
      href: "https://www.boras.se/bobyggaochtrafik/byggarivaellerforandra.4.46966c1e1580c421fba959a6.html",
      label: "Borås Stad: bygga, riva eller förändra",
      body: "Borås Stad har vägledning om bygglov, anmälan och vilka ritningar som kan behövas. Använd informationen för din fastighet när du planerar en ändring av rum, väggar eller installationer.",
    },
    altan: {
      href: "https://www.boras.se/bobyggaochtrafik/byggarivaellerforandra/behoverjagbygglov/altan.4.3353d1f3177732d0c5c1a07e.html",
      label: "Borås Stad: regler och handlingar för altan",
      body: "Borås Stad beskriver hur höjd, placering och detaljplan påverkar lovfrågan för altaner. Där finns också en lista över ritningar som kan behövas. Kontrollera förutsättningarna för din fastighet innan utformningen bestäms.",
    },
  },
  kungsbacka: {
    alteration: {
      href: "https://kungsbacka.se/bygga-bo-och-miljo/bygga-nytt-andra-eller-riva/vad-ska-du-bygga/andra-i-befintlig-byggnad",
      label: "Kungsbacka kommun: ändra i befintlig byggnad",
      body: "Kungsbacka kommun beskriver när ändringar av stomme, brandskydd och installationer behöver anmälas. På sidan finns även hjälp med ritningar och länkar till detaljplaner. Stäm av vad som gäller för den ändring du planerar.",
    },
    altan: {
      href: "https://kungsbacka.se/bygga-bo-och-miljo/bygga-nytt-andra-eller-riva/vad-ska-du-bygga/altan",
      label: "Kungsbacka kommun: planera och söka lov för altan",
      body: "Kungsbacka kommun har en särskild guide för altaner med information inför planering och eventuell ansökan. Utgå från din fastighet, altanens placering och utformning när du kontrollerar vilka steg som behövs.",
    },
  },
};

export function getLocalGuidance(serviceSlug, areaSlug) {
  // Ordinary flooring and cabinet installation do not benefit from a generic permit section.
  if (["golvlaggning", "koksmontering"].includes(serviceSlug)) return null;
  return guidance[areaSlug]?.[serviceSlug === "altanbygge" ? "altan" : "alteration"] ?? null;
}
