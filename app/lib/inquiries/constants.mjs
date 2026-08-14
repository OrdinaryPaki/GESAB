export const INQUIRY_SOURCES = Object.freeze(["contact", "footer", "service"]);

export const INQUIRY_LIMITS = Object.freeze({
  email: 254,
  firstName: 80,
  lastName: 80,
  message: 5000,
  name: 160,
  phone: 40,
  service: 100,
});

export const SERVICE_TITLES = Object.freeze({
  badrumsrenovering: "Badrumsrenovering",
  tvattstugsrenovering: "Tvättstugsrenovering",
  koksrenovering: "Köksrenovering",
  totalentreprenad: "Totalentreprenad",
  rivningsarbeten: "Rivningsarbeten",
  bygg: "Bygg",
});
