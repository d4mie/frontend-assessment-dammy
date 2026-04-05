import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("disables Prev on the first page", () => {
    render(<Pagination page={1} pageCount={3} q="phone" category="beauty" />);

    const prev = screen.getByRole("link", { name: "Previous" });
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).toHaveAttribute("tabindex", "-1");
    expect(prev).toHaveAttribute("href", "/products?page=1&q=phone&category=beauty");
  });

  it("includes q/category in page links", () => {
    render(<Pagination page={2} pageCount={3} q="phone" category="beauty" />);

    const current = screen.getByRole("link", { name: "2" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("href", "/products?page=2&q=phone&category=beauty");

    const next = screen.getByRole("link", { name: "Next" });
    expect(next).toHaveAttribute("href", "/products?page=3&q=phone&category=beauty");
  });
});

