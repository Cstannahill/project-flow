"use client";
import React from "react";
import ReactPlayer from "react-player";
import { ComponentProps } from "@/types/base";

interface MediaPlayerProps extends ComponentProps {
  url: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  className = "",
  url,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  style,
}) => (
  <div
    className={`aspect-video overflow-hidden rounded-lg shadow ${className}`}
    style={style}
  >
    <ReactPlayer
      url={url}
      controls={controls}
      playing={autoPlay}
      loop={loop}
      muted={muted}
      width="100%"
      height="100%"
    />
  </div>
);

export default MediaPlayer;
