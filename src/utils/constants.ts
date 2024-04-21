export const DEFAULT_WEBSITE_SETTINGS = Object.freeze({
  title: "Barbershop",
  description: "Barbershop website",
});

export const PAGE_ROUTES = Object.freeze({
  home: {
    name: "Acasa",
    path: "/",
  },
  gallery: {
    name: "Galerie",
    path: "/galerie",
  },
  servicii: {
    name: "Servicii",
    path: "/servicii",
  },
  contact: {
    name: "Contact",
    path: "/contact",
  },
});

export const SANITY_DOC_TYPES = Object.freeze({
  siteSettings: "siteSettings",
  siteLogo: "siteLogo",
  shopLocation: "shopLocation",
  heroImage: "heroImage",
  galleryImage: "galleryImage",
  barber: "barber",
});
