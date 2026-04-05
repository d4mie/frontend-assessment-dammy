import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders links and marks last item as current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: "Example Product" },
        ]}
      />,
    );

    const productsLink = screen.getByRole("link", { name: "Products" });
    expect(productsLink).toHaveAttribute("href", "/products");

    const current = screen.getByText("Example Product");
    expect(current).toHaveAttribute("aria-current", "page");
  });
});

