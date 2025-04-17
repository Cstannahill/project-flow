import React from "react";
import PhotoAlbum, {
  ColumnsPhotoAlbum,
  MasonryPhotoAlbum,
  RowsPhotoAlbum,
} from "react-photo-album";
import { ComponentProps } from "../types/base";
import { useState, useEffect } from "react";
import "react-photo-album/rows.css";
import "react-photo-album/columns.css";
import "react-photo-album/masonry.css";
import "react-photo-album/styles.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";

// import "yet-another-react-lightbox/plugins/zoom.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
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
  console.log("layout", layout);
  return (
    <>
      {layout == "rows" ? (
        <RowsPhotoAlbum
          targetRowHeight={150}
          photos={photos}
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
          spacing={spacing}
          onClick={({ index }) => setIndex(index)}
        />
      )}

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Captions]}
      />
    </>
  );
};

export default ImageGallery;
