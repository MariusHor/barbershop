import { cn } from "@/utils/helpers";
import React, { forwardRef } from "react";
import ReactCarousel, { type CarouselProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CustomImage from "./custom-image";
import { type GalleryImage } from "sanity.types";

interface CustomCarouselProps {
  images?: GalleryImage[];
}

export const CustomCarousel = forwardRef<
  ReactCarousel,
  Omit<CarouselProps, "children"> & CustomCarouselProps
>(
  (
    {
      images,
      className,
      autoPlay = true,
      infinite = false,
      showDots = false,
      arrows = false,
      swipeable = true,
      draggable = false,
      autoPlaySpeed = 5000,
      rewind = true,
      ...config
    },
    ref,
  ) => {
    if (!images?.length) return null;

    const defaultConfig = {
      itemClass: "h-full",
      containerClass: "h-full",
      sliderClass: "h-full",
      autoPlay,
      infinite,
      showDots,
      arrows,
      swipeable,
      draggable,
      autoPlaySpeed,
      rewind,
      ...config,
    };

    return (
      <ReactCarousel
        ref={ref}
        className={cn("shadow-2xl", className)}
        {...defaultConfig}
      >
        {images.map((item, index) => (
          <CustomImage
            key={index}
            src={item.image}
            alt={item.image.alt ?? `Carousel image ${index + 1}`}
            width={item.image.width}
            height={item.image.height}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </ReactCarousel>
    );
  },
);

CustomCarousel.displayName = "CustomCarousel";

export default CustomCarousel;
