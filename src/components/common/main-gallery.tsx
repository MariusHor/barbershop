import { urlFor } from "@/lib/sanity/client";
import { api } from "@/utils/api";
import { Gallery } from "./gallery";
import { Button } from "../ui/button";
import { BaseSpinner } from "../base/base-spinner";

export const MainGallery = ({ width }: { width: number }) => {
  const {
    data: galleryImages,
    isFetching,
    isLoading,
    fetchNextPage,
  } = api.content.getGalleryImages.useInfiniteQuery(
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

  return (
    !!_galleryImages?.length && (
      <div className="flex w-full flex-col gap-8">
        <Gallery width={width} data={_galleryImages} />
        {hasMoreItems && (
          <Button
            onClick={() => fetchNextPage()}
            variant={"outline"}
            className="m-auto h-14 w-36 rounded-none border-muted-foreground bg-background-secondary text-lg font-[300] text-dark hover:bg-primary-foreground hover:text-muted"
          >
            {isFetching && !isLoading ? <BaseSpinner /> : "Mai multe"}
          </Button>
        )}
      </div>
    )
  );
};
