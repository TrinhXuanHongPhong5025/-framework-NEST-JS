import { fireEvent, render, screen } from "@testing-library/react";
import Banner from "./Banner";

test("shows saved items first in one carousel and opens a wide profile view", async () => {
  const artifacts = [
    {
      id: 1,
      category: "hot-hit",
      title: "Hot hit item",
      imageData: "data:image/png;base64,aG90",
      description: "Featured description",
    },
    {
      id: 2,
      category: "artifact",
      title: "Museum artifact",
      imageData: "data:image/png;base64,YXJ0",
      description: "Artifact description",
    },
  ];
  const { container } = render(<Banner artifacts={artifacts} favorites={[]} onToggleFavorite={jest.fn()} />);

  expect(screen.queryByRole("tablist", { name: "Danh mục hiện vật" })).not.toBeInTheDocument();
  expect(container.querySelector(".banner-card img")).toHaveAttribute("alt", "Hot hit item");
  expect(screen.getAllByText("Hot hit item").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Museum artifact").length).toBeGreaterThan(0);
  fireEvent.click(screen.getAllByText("Museum artifact")[0]);

  expect(await screen.findByRole("heading", { name: "Museum artifact" })).toBeInTheDocument();
  expect(screen.getByText("Artifact description")).toBeInTheDocument();
});

test("shows the Hot hit edit flag to admins and opens that exact item", () => {
  const hotHit = {
    id: 7,
    category: "hot-hit",
    title: "Featured exhibit",
    imageData: "data:image/png;base64,aG90",
    description: "Featured details",
  };
  const onEditArtifact = jest.fn();
  render(
    <Banner
      artifacts={[hotHit]}
      favorites={[]}
      isAdmin
      onEditArtifact={onEditArtifact}
      onToggleFavorite={jest.fn()}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Sửa Featured exhibit" })[0]);

  expect(onEditArtifact).toHaveBeenCalledWith(hotHit);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("shows an edit control in the detail view for saved items only", async () => {
  const artifact = {
    id: 9,
    category: "artifact",
    title: "Museum item",
    imageData: "data:image/png;base64,aXRlbQ==",
    description: "Item information",
  };
  const onEditArtifact = jest.fn();
  render(
    <Banner
      artifacts={[artifact]}
      favorites={[]}
      isAdmin
      onEditArtifact={onEditArtifact}
      onToggleFavorite={jest.fn()}
    />,
  );

  fireEvent.click(screen.getAllByText("Museum item")[0]);
  fireEvent.click(await screen.findByRole("button", { name: "Sửa thông tin Museum item" }));

  expect(onEditArtifact).toHaveBeenCalledWith(artifact);
});