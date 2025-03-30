import React from "react";
import PhotoAlbum, {
  ColumnsPhotoAlbum,
  MasonryPhotoAlbum,
} from "react-photo-album";
import { ComponentProps } from "../types/base";
import { useState, useEffect } from "react";
import "react-photo-album/rows.css";
import "react-photo-album/columns.css";
import "react-photo-album/masonry.css";
import "react-photo-album/styles.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
// interface
interface ImageGalleryProps extends ComponentProps {
  photos: { src: string; width: number; height: number; alt?: string }[];
  layout?: "rows" | "columns" | "masonry";
  spacing?: number;
  columns?: number;
  onPhotoClick?: (photoIndex: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  className = "",
  photos,
  layout = "columns",
  spacing = 6,
  columns = 2,
}) => {
  const [index, setIndex] = useState(-1);

  useEffect(() => {}, [index]);

  return (
    <>
      {layout == "rows" ? (
        <PhotoAlbum
          photos={photos}
          layout="rows"
          onClick={({ index }) => setIndex(index)}
        />
      ) : layout == "columns" ? (
        <ColumnsPhotoAlbum
          photos={photos}
          columns={columns}
          spacing={spacing}
          onClick={({ index }) => setIndex(index)}
        />
      ) : (
        <MasonryPhotoAlbum
          photos={photos}
          columns={columns}
          spacing={spacing}
          onClick={({ index }) => setIndex(index)}
        />
      )}

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
};

export default ImageGallery;
