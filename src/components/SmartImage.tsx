"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export type SmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function SmartImage({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  onError,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const finalSrc = !src || failed ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}

