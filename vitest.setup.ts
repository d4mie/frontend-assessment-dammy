import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: unknown;
      children: React.ReactNode;
      [key: string]: unknown;
    }) => {
      const url =
        typeof href === "string"
          ? href
          : typeof href === "object" && href && "pathname" in href
            ? String((href as { pathname?: unknown }).pathname ?? "")
            : "";

      return React.createElement("a", { href: url, ...props }, children);
    },
  };
});

vi.mock("next/image", () => {
  return {
    default: ({
      src,
      alt,
      ...props
    }: {
      src: unknown;
      alt: string;
      [key: string]: unknown;
    }) => {
      const url =
        typeof src === "string"
          ? src
          : typeof src === "object" && src && "src" in src
            ? String((src as { src?: unknown }).src ?? "")
            : "";

      return React.createElement("img", { src: url, alt, ...props });
    },
  };
});

