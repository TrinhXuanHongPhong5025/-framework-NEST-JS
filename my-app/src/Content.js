import { useState } from "react";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Modal,
  Button,
  Alert,
} from "react-bootstrap";
import { API_BASE_URL } from "./api";

function Content({ users, isAdmin, authToken, favoriteProfileIds, selectedUser, onToggleProfileFavorite, onOpenProfile, onCloseProfile, onUpdateUser }) {
  const [search, setSearch] = useState("");
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const filterUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const startProfileEdit = (user) => {
    setEditingProfile(user);
    setProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website,
      companyName: user.company.name,
      street: user.address.street,
      city: user.address.city,
      imageData: user.image || "",
    });
    setProfileError("");
  };

  const selectProfileImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      setProfileError("Chọn ảnh PNG, JPG hoặc WebP có dung lượng tối đa 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileForm((current) => ({ ...current, imageData: String(reader.result) }));
    reader.onerror = () => setProfileError("Không thể đọc ảnh profile.");
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSaving(true);
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/profiles/${editingProfile.id}`,
        { ...profileForm, imageData: profileForm.imageData || null },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );
      const updatedUser = {
        ...editingProfile,
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        image: data.imageData,
        company: { ...editingProfile.company, name: data.companyName },
        address: { ...editingProfile.address, street: data.street, city: data.city },
      };
      onUpdateUser(updatedUser);
      setEditingProfile(null);
      setProfileForm(null);
    } catch (requestError) {
      const message = requestError.response?.data?.message;
      setProfileError(Array.isArray(message) ? message.join("; ") : message || "Không thể lưu profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <Container className="my-5">

      {/* Statistics */}

      <Row className="mb-4 g-4">

        <Col md={4}>
          <div className="stats-card">
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="stats-card">
            <h2>{new Set(users.map((u) => u.company.name)).size}</h2>
            <p>Companies</p>
          </div>
        </Col>

        <Col md={4}>
          <div className="stats-card">
            <h2>React</h2>
            <p>Bootstrap UI</p>
          </div>
        </Col>

      </Row>

      {/* Search */}

      <Form className="mb-5">

        <Form.Control
          className="search-box"
          placeholder="🔍 Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </Form>

      {/* User Card */}

      <Row className="g-4">

        {filterUsers.map((user) => (

          <Col lg={4} md={6} key={user.id}>

            <Card className="user-card">

              <button
                type="button"
                className={`profile-favorite ${favoriteProfileIds.includes(user.id) ? "is-favorite" : ""}`}
                aria-label={favoriteProfileIds.includes(user.id) ? `Bỏ yêu thích profile ${user.name}` : `Yêu thích profile ${user.name}`}
                aria-pressed={favoriteProfileIds.includes(user.id)}
                onClick={() => onToggleProfileFavorite(user.id)}
              >
                <i className={`bi ${favoriteProfileIds.includes(user.id) ? "bi-heart-fill" : "bi-heart"}`} aria-hidden="true"></i>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="profile-edit"
                  aria-label={`Sửa profile ${user.name}`}
                  title="Sửa thông tin profile"
                  onClick={() => startProfileEdit(user)}
                >
                  <i className="bi bi-wrench-adjustable" aria-hidden="true"></i>
                </button>
              )}

              <Card.Body>

                <div className="avatar">

                  {user.name.charAt(0)}

                </div>

                <h4>{user.name}</h4>

                <p>📧 {user.email}</p>

                <p>🏢 {user.company.name}</p>

                <p>🌐 {user.website}</p>

                <button
                  className="profile-btn"
                  onClick={() => onOpenProfile(user)}
                >
                  View Profile
                </button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

      {/* Modal */}

      <Modal
        show={Boolean(selectedUser)}
        onHide={onCloseProfile}
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>

            👤 User Profile

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {selectedUser && (

            <>

              <div className="user-profile-cover">
                {selectedUser.image ? (
                  <img src={selectedUser.image} alt={`${selectedUser.name} profile`} />
                ) : (
                  <span>{selectedUser.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="user-profile-name">{selectedUser.name}</h3>

              <p><strong>📧 Email:</strong> {selectedUser.email}</p>

              <p><strong>📱 Phone:</strong> {selectedUser.phone}</p>

              <p><strong>🌍 Website:</strong> {selectedUser.website}</p>

              <p><strong>🏢 Company:</strong> {selectedUser.company.name}</p>

              <p>

                <strong>🏠 Address:</strong>{" "}

                {selectedUser.address.street},{" "}

                {selectedUser.address.city}

              </p>

            </>

          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={onCloseProfile}
          >

            Close

          </Button>

        </Modal.Footer>

      </Modal>

      <Modal show={Boolean(editingProfile)} onHide={() => setEditingProfile(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sửa profile {editingProfile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileForm && (
            <Form onSubmit={saveProfile}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="profile-image-file">Ảnh cover</Form.Label>
                <label className="profile-cover-upload" htmlFor="profile-image-file">
                  {profileForm.imageData ? <img src={profileForm.imageData} alt="Ảnh cover xem trước" /> : <span>Chọn ảnh cover</span>}
                </label>
                <Form.Control id="profile-image-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectProfileImage} className="visually-hidden" />
              </Form.Group>
              <div className="profile-edit-grid">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-name">Tên</Form.Label>
                  <Form.Control id="profile-name" required value={profileForm.name} onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-email">Email</Form.Label>
                  <Form.Control id="profile-email" required type="email" value={profileForm.email} onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-phone">Điện thoại</Form.Label>
                  <Form.Control id="profile-phone" required value={profileForm.phone} onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-website">Website</Form.Label>
                  <Form.Control id="profile-website" required value={profileForm.website} onChange={(event) => setProfileForm((current) => ({ ...current, website: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-company">Công ty</Form.Label>
                  <Form.Control id="profile-company" required value={profileForm.companyName} onChange={(event) => setProfileForm((current) => ({ ...current, companyName: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-street">Đường</Form.Label>
                  <Form.Control id="profile-street" required value={profileForm.street} onChange={(event) => setProfileForm((current) => ({ ...current, street: event.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="profile-city">Thành phố</Form.Label>
                  <Form.Control id="profile-city" required value={profileForm.city} onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))} />
                </Form.Group>
              </div>
              {profileError && <Alert variant="danger">{profileError}</Alert>}
              <div className="artifact-form-actions">
                <Button variant="secondary" type="button" onClick={() => setEditingProfile(null)}>Hủy</Button>
                <Button variant="primary" type="submit" disabled={profileSaving}>
                  {profileSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );

}

export default Content;