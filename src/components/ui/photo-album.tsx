import BasePhotoAlbum, {
  type Photo,
  type PhotoAlbumProps,
} from "react-photo-album";

export const PhotoAlbum = <T extends Photo>({
  data,
  width,
  layout = "masonry",
}: { data: Photo[]; width: number } & Partial<PhotoAlbumProps<T>>) => {
  const containerGap = width < 768 ? "1px" : width < 1024 ? "2px" : "8px";
  const columnContainerW = width < 768 ? "100%" : width < 1024 ? "50%" : "33%";
  const columnContainerGap = width < 768 ? "1px" : width < 1024 ? "2px" : "8px";
  const columns = width < 768 ? 1 : width < 1024 ? 2 : 3;
  const imageStyle = { width: "100%", marginBottom: 0 };

  return (
    <div className="w-full">
      <BasePhotoAlbum
        componentsProps={{
          containerProps: {
            style: {
              gap: containerGap,
            },
          },
          columnContainerProps: {
            style: {
              width: columnContainerW,
              gap: columnContainerGap,
            },
          },
          imageProps: { style: imageStyle },
        }}
        columns={columns}
        layout={layout}
        photos={data}
      />
    </div>
  );
};
