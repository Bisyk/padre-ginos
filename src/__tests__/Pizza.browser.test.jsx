import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Pizza from "../Pizza";

test("alt text renders on image", async () => {
  const name = "My favorite pizza";
  const src = "https://picsum.photos/300";
  const screen = render(
    <Pizza name={name} description="super cool pizza" image={src} />
  )

  const img = await screen.getByRole("img");

  await expect.element(img).toBeInTheDocument();
  await expect.element(img).toHaveAttribute("src", src);
  await expect.element(img).toHaveAttribute("alt", name);

});