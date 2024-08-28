import {
  type SanityImageCrop,
  type SanityImageHotspot,
  type internalGroqTypeReferenceTo,
} from "sanity.types";

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
  marqueeText?: string;
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
    width?: number;
    height?: number;
    _type: "image";
  };
  _type: "section";
  _key: string;
};
