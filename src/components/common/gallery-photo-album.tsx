import { urlFor } from "@/lib/sanity/client";
import { api } from "@/utils/api";
import { PhotoAlbum } from "../ui/photo-album";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useState } from "react";

export const GalleryPhotoAlbum = ({ width }: { width: number }) => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data: galleryImages, fetchNextPage } =
    api.content.getGalleryImages.useInfiniteQuery(
      { limit: 2 },
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
      <div className="flex w-full flex-col gap-8">
        <PhotoAlbum width={width} data={_galleryImages} />
        {hasMoreItems && (
          <Button
            onClick={handleFetchMore}
            variant="outline"
            className="m-auto h-14 w-36 rounded-none border-muted-foreground bg-background-secondary text-lg font-[300] text-dark hover:bg-primary-foreground hover:text-muted"
            disabled={isFetchingMore}
          >
            {isFetchingMore ? <Spinner /> : "Mai multe"}
          </Button>
        )}
      </div>
    )
  );
};
