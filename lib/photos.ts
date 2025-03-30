import type { Photo } from "react-photo-album";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

function imageLink(
  path: string,
  width: number,
  height: number,
  size: number,
  extension: string
) {
  return `http://localhost:3000/${path}.${width}x${height}.${extension}`;
}

const photos = [
  {
    src: "/media/asht.768x610.jpg",
    alt: "Ashley",
  },
  {
    src: "/media/asht2.768x1024.jpg",
    alt: "Ashley",
  },
  {
    src: "/media/ashtbent.768x831.jpg",
    alt: "Ashley",
  },
  {
    src: "/media/ashtbent2.756x1024.jpg",
    alt: "Ashley",
  },
  {
    src: "/media/ashtbentover.768x853.jpg",
    alt: "Ashley",
  },
].map(({ src, ...rest }) => {
  const matcher = src.match(/^(.*)\.(\d+)x(\d+)\.(.*)$/)!;
  if (!matcher) {
    throw new Error(`Invalid image path: ${src}`);
  }

  const path = matcher[1];
  const width = Number.parseInt(matcher[2], 10);
  const height = Number.parseInt(matcher[3], 10);
  const extension = matcher[4];

  let newwidth = width;
  let newheight = height;
  if (width < 1000) {
    newwidth = 2000;
    newheight = 2000;
  }
  return {
    src: imageLink(path, width, height, width, extension),
    width: newwidth,
    height: newheight,

    ...rest,
  } as Photo;
});

export default photos;
