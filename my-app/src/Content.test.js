import { render, screen, within } from "@testing-library/react";
import { fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Content from "./Content";

jest.mock("axios");

test("shows the profile initial in a full-width cover region", () => {
  const user = {
    id: 1,
    name: "Casey Example",
    email: "casey@example.com",
    phone: "555-0100",
    website: "casey.example.com",
    company: { name: "Example Co." },
    address: { street: "Main St", city: "Example City" },
  };
  render(
    <Content
      users={[user]}
      favoriteProfileIds={[]}
      selectedUser={user}
      onToggleProfileFavorite={jest.fn()}
      onOpenProfile={jest.fn()}
      onCloseProfile={jest.fn()}
    />,
  );

  const coverInitial = within(screen.getByRole("dialog")).getByText("C");
  expect(coverInitial.parentElement).toHaveClass("user-profile-cover");
  expect(within(screen.getByRole("dialog")).getByText("Casey Example")).toBeInTheDocument();
});

test("admins can edit and persist profile information from the wrench button", async () => {
  const user = {
    id: 4,
    name: "Casey Example",
    email: "casey@example.com",
    phone: "555-0100",
    website: "casey.example.com",
    company: { name: "Example Co." },
    address: { street: "Main St", city: "Example City" },
  };
  const onUpdateUser = jest.fn();
  axios.patch.mockResolvedValue({
    data: {
      id: 4,
      name: "Casey Revised",
      email: "casey@example.com",
      phone: "555-0100",
      website: "casey.example.com",
      companyName: "Example Co.",
      street: "Main St",
      city: "Example City",
      imageData: null,
    },
  });
  render(
    <Content
      users={[user]}
      isAdmin
      authToken="admin-token"
      favoriteProfileIds={[]}
      selectedUser={null}
      onToggleProfileFavorite={jest.fn()}
      onOpenProfile={jest.fn()}
      onCloseProfile={jest.fn()}
      onUpdateUser={onUpdateUser}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Sửa profile Casey Example" }));
  fireEvent.change(screen.getByLabelText("Tên"), { target: { value: "Casey Revised" } });
  fireEvent.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

  await waitFor(() => expect(axios.patch).toHaveBeenCalledWith(
    "/profiles/4",
    expect.objectContaining({ name: "Casey Revised", imageData: null }),
    { headers: { Authorization: "Bearer admin-token" } },
  ));
  expect(onUpdateUser).toHaveBeenCalledWith(expect.objectContaining({ name: "Casey Revised" }));
});