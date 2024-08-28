import {
  type SanityImageCrop,
  type SanityImageHotspot,
  type internalGroqTypeReferenceTo,
} from "sanity.types";

export type GalleryImage = {
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
};

export type PageSection = {
  title: string;
  subtitle?: string;
  content?: string;
  ctaButton?: {
    text: string;
  };
  linkButton?: {
    text: string;
    href: string;
  };
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    width: number;
    height: number;
    _type: "image";
  };
  _type: "section";
  _key: string;
};
