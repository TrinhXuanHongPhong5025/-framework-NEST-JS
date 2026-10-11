import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import ArtifactManager from "./ArtifactManager";

jest.mock("axios");

test("creates a hot hit item with its uploaded image and description", async () => {
  const onArtifactsChange = jest.fn();
  const savedArtifact = {
    id: 12,
    title: "Bronze bell",
    category: "hot-hit",
    imageData: "data:image/png;base64,YmVsbA==",
    description: "A historic bronze bell.",
  };
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({ data: savedArtifact });
  render(
    <ArtifactManager
      show
      onHide={jest.fn()}
      token="admin-token"
      artifacts={[]}
      onArtifactsChange={onArtifactsChange}
    />,
  );

  fireEvent.change(screen.getByLabelText("Tên hiện vật"), { target: { value: "Bronze bell" } });
  fireEvent.change(screen.getByLabelText("Mô tả"), { target: { value: "A historic bronze bell." } });
  fireEvent.click(screen.getByRole("button", { name: "Hot hit" }));
  fireEvent.change(screen.getByLabelText("Ảnh hiện vật"), {
    target: { files: [new File(["bell"], "bell.png", { type: "image/png" })] },
  });
  await waitFor(() => expect(screen.getByRole("button", { name: "Lưu hiện vật" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Lưu hiện vật" }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    "/artifacts",
    expect.objectContaining({
      title: "Bronze bell",
      category: "hot-hit",
      description: "A historic bronze bell.",
      imageData: expect.stringMatching(/^data:image\/png;base64,/),
    }),
    { headers: { Authorization: "Bearer admin-token" } },
  ));
  expect(onArtifactsChange).toHaveBeenCalledWith([savedArtifact]);
  expect(await screen.findByText("Đã thêm hiện vật.")).toBeInTheDocument();
});

test("keeps edit actions available without rendering the artifact table", async () => {
  const artifact = {
    id: 2,
    title: "Existing exhibit",
    category: "artifact",
    imageData: "data:image/png;base64,YXJ0",
    description: "Existing description",
  };
  axios.get.mockReturnValue(new Promise(() => {}));
  render(
    <ArtifactManager
      show
      onHide={jest.fn()}
      token="admin-token"
      artifacts={[artifact]}
      onArtifactsChange={jest.fn()}
    />,
  );

  expect(screen.queryByText(/Danh sách hiện vật/)).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Chọn hiện vật để sửa hoặc xóa"), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: "Sửa" }));

  expect(screen.getByLabelText("Tên hiện vật")).toHaveValue("Existing exhibit");
  expect(screen.getByRole("button", { name: "Cập nhật" })).toBeInTheDocument();
});