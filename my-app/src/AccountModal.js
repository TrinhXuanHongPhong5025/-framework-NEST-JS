import { useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { API_BASE_URL } from "./api";

function AccountModal({ show, onHide, user, token, authChecking, onAuthenticated, onLogout }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicMode, setPublicMode] = useState("login");

  const getErrorMessage = (requestError) => {
    const message = requestError.response?.data?.message;
    return Array.isArray(message) ? message.join("; ") : message || "Không thể kết nối máy chủ.";
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      onAuthenticated(response.data);
      setPassword("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/auth/admins`,
        { username, email, password },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccess("Tạo tài khoản quản trị viên thành công.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
      setSuccess("Tạo tài khoản thành công. Bạn có thể đăng nhập.");
      setPassword("");
      setPublicMode("login");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setError("");
    setSuccess("");
    onHide();
  };

  return (
    <Modal show={show} onHide={closeModal} centered className="account-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {authChecking ? "Đang xác thực" : user?.role === "admin" ? "Quản lý tài khoản" : user ? "Tài khoản" : "Tài khoản"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {authChecking ? (
          <p className="mb-0">Đang kiểm tra phiên đăng nhập...</p>
        ) : user?.role === "admin" ? (
          <>
            <div className="account-session">
              <span>Đang đăng nhập</span>
              <strong>{user.username}</strong>
              <Button variant="outline-secondary" size="sm" onClick={onLogout}>Đăng xuất</Button>
            </div>
            <hr />
            <h5 className="mb-3">Tạo tài khoản quản trị viên</h5>
            <Form onSubmit={handleCreateAdmin}>
              <Form.Group className="mb-3" controlId="admin-username">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control required minLength={3} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="admin-email">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="admin-password">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Button type="submit" disabled={loading} className="admin-submit">
                {loading ? "Đang lưu..." : "Tạo tài khoản"}
              </Button>
            </Form>
          </>
        ) : user ? (
          <div className="account-session">
            <p>Tài khoản <strong>{user.username}</strong> không có quyền quản trị.</p>
            <Button variant="outline-secondary" onClick={onLogout}>Đăng xuất</Button>
          </div>
        ) : (
          <>
          <div className="account-create-switch mb-3" role="group" aria-label="Chọn đăng nhập hoặc đăng ký">
            <Button variant={publicMode === "login" ? "primary" : "outline-secondary"} onClick={() => { setPublicMode("login"); setError(""); setSuccess(""); }}>Đăng nhập</Button>
            <Button variant={publicMode === "register" ? "primary" : "outline-secondary"} onClick={() => { setPublicMode("register"); setError(""); setSuccess(""); }}>Đăng ký</Button>
          </div>
          <Form onSubmit={publicMode === "login" ? handleLogin : handleRegister}>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </Form.Group>
            {publicMode === "register" && (
              <Form.Group className="mb-3" controlId="register-email">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control required minLength={publicMode === "register" ? 8 : undefined} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={publicMode === "register" ? "new-password" : "current-password"} />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button type="submit" disabled={loading} className="admin-submit">
              {loading ? "Đang xử lý..." : publicMode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </Button>
          </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default AccountModal;