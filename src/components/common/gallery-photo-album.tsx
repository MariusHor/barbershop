import { urlFor } from "@/lib/sanity/client";
import { api } from "@/utils/api";
import { PhotoAlbum } from "../ui/photo-album";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/utils/helpers";

export const GalleryPhotoAlbum = ({
  width,
  limit = 10,
  className,
  showMoreBtn = false,
}: {
  width: number;
  limit?: number;
  className?: string;
  showMoreBtn?: boolean;
}) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data: galleryImages, fetchNextPage } =
    api.content.getGalleryImages.useInfiniteQuery(
      { limit },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const _galleryImages =
    galleryImages?.pages.flatMap((page) =>
      page.items.map((item) => ({
        src: urlFor(item.image).url(),
        width: item.image.width ?? 0,
        height: item.image.height ?? 0,
      })),
    ) ?? [];

  const totalItems = galleryImages?.pages.at(-1)?.totalCount;
  const hasMoreItems = totalItems && totalItems > _galleryImages.length;

  const handleFetchMore = async () => {
    setIsFetchingMore(true);
    await fetchNextPage();
    setIsFetchingMore(false);
  };

  return (
    !!_galleryImages?.length && (
      <div className={cn("flex w-full flex-col gap-8", className)}>
        <PhotoAlbum width={width} data={_galleryImages} />
        {hasMoreItems && showMoreBtn && (
          <Button
            onClick={handleFetchMore}
            variant="outline"
            className="m-auto h-14 w-36"
            isLoading={isFetchingMore}
          >
            Mai multe
          </Button>
        )}
      </div>
    )
  );
};
