import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AccountModal from "./AccountModal";

jest.mock("axios");

test("submits admin account creation with the active bearer token", async () => {
  axios.post.mockResolvedValue({ data: { id: 4 } });
  render(
    <AccountModal
      show
      onHide={jest.fn()}
      user={{ username: "root", role: "admin" }}
      token="admin-jwt"
      authChecking={false}
      onAuthenticated={jest.fn()}
      onLogout={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "new-admin" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "securepass123" } });
  fireEvent.click(screen.getByRole("button", { name: "Tạo tài khoản" }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    "/auth/admins",
    { username: "new-admin", email: "admin@example.com", password: "securepass123" },
    { headers: { Authorization: "Bearer admin-jwt" } },
  ));
  expect(await screen.findByText("Tạo tài khoản quản trị viên thành công.")).toBeInTheDocument();
});

test("allows account registration without an admin session", async () => {
  axios.post.mockResolvedValueOnce({ data: { id: 5, role: "admin" } });
  render(
    <AccountModal
      show
      onHide={jest.fn()}
      user={null}
      token={null}
      authChecking={false}
      onAuthenticated={jest.fn()}
      onLogout={jest.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Đăng ký" }));
  fireEvent.change(screen.getByLabelText("Tên đăng nhập"), { target: { value: "new-admin" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.com" } });
  fireEvent.change(screen.getByLabelText("Mật khẩu"), { target: { value: "adminpass123" } });
  fireEvent.click(screen.getByRole("button", { name: "Tạo tài khoản", exact: true }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    "/auth/register",
    { username: "new-admin", email: "admin@example.com", password: "adminpass123" },
  ));
  expect(await screen.findByText("Tạo tài khoản thành công. Bạn có thể đăng nhập.")).toBeInTheDocument();
});