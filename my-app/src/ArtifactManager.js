import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { API_BASE_URL } from "./api";

const emptyForm = { title: "", category: "artifact", imageData: "", description: "" };

function ArtifactManager({ show, onHide, token, artifacts, initialArtifact, onArtifactsChange }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detail, setDetail] = useState(null);

  const requestConfig = { headers: { Authorization: `Bearer ${token}` } };

  const getErrorMessage = (requestError) => {
    const message = requestError.response?.data?.message;
    return Array.isArray(message) ? message.join("; ") : message || "Không thể kết nối máy chủ.";
  };

  const loadArtifacts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/artifacts`);
      onArtifactsChange(response.data);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }, [onArtifactsChange]);

  useEffect(() => {
    if (show) loadArtifacts();
  }, [show, loadArtifacts]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedArtifactId("");
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    if (!show) return;
    if (initialArtifact) {
      setForm({
        title: initialArtifact.title,
        category: initialArtifact.category,
        imageData: initialArtifact.imageData,
        description: initialArtifact.description,
      });
      setEditingId(initialArtifact.id);
      setSelectedArtifactId(String(initialArtifact.id));
      setError("");
      setSuccess("");
    } else {
      resetForm();
    }
  }, [show, initialArtifact]);

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setError("Chỉ hỗ trợ ảnh PNG, JPG hoặc WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ảnh không được vượt quá 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, imageData: String(reader.result) }));
      setError("");
    };
    reader.onerror = () => setError("Không thể đọc tệp ảnh.");
    reader.readAsDataURL(file);
  };

  const saveArtifact = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = editingId
        ? await axios.patch(`${API_BASE_URL}/artifacts/${editingId}`, form, requestConfig)
        : await axios.post(`${API_BASE_URL}/artifacts`, form, requestConfig);
      const nextArtifacts = editingId
        ? artifacts.map((item) => item.id === editingId ? response.data : item)
        : [response.data, ...artifacts];
      onArtifactsChange(nextArtifacts);
      setSuccess(editingId ? "Đã cập nhật hiện vật." : "Đã thêm hiện vật.");
      setForm(emptyForm);
      setEditingId(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const editArtifact = (artifact) => {
    setForm({
      title: artifact.title,
      category: artifact.category,
      imageData: artifact.imageData,
      description: artifact.description,
    });
    setEditingId(artifact.id);
    setSelectedArtifactId(String(artifact.id));
    setError("");
    setSuccess("");
    setDetail(null);
  };

  const deleteArtifact = async (artifact) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${artifact.title}" không?`)) return;
    setError("");
    try {
      await axios.delete(`${API_BASE_URL}/artifacts/${artifact.id}`, requestConfig);
      const nextArtifacts = artifacts.filter((item) => item.id !== artifact.id);
      onArtifactsChange(nextArtifacts);
      if (editingId === artifact.id) resetForm();
      else setSelectedArtifactId("");
      setSuccess("Đã xóa hiện vật.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="xl" className="artifact-manager-modal">
        <Modal.Header closeButton>
          <Modal.Title>Quản lý hiện vật</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="existing-artifact">
            <Form.Label>Chọn hiện vật để sửa hoặc xóa</Form.Label>
            <Form.Select
              value={selectedArtifactId}
              onChange={(event) => {
                setSelectedArtifactId(event.target.value);
                if (!event.target.value) resetForm();
              }}
            >
              <option value="">Thêm hiện vật mới</option>
              {artifacts.map((artifact) => (
                <option value={artifact.id} key={artifact.id}>
                  {artifact.title} ({artifact.category === "hot-hit" ? "Hot hit" : "Hiện vật"})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {selectedArtifactId && (
            <div className="artifact-form-actions artifact-selection-actions">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setDetail(artifacts.find((item) => item.id === Number(selectedArtifactId)))}
              >
                Xem chi tiết
              </Button>
              <Button
                type="button"
                variant="outline-primary"
                onClick={() => editArtifact(artifacts.find((item) => item.id === Number(selectedArtifactId)))}
              >
                Sửa
              </Button>
              <Button
                type="button"
                variant="outline-danger"
                onClick={() => deleteArtifact(artifacts.find((item) => item.id === Number(selectedArtifactId)))}
              >
                Xóa
              </Button>
            </div>
          )}
          <Form onSubmit={saveArtifact}>
            <div className="artifact-category-switch" role="group" aria-label="Loại hiện vật">
              <Button
                type="button"
                variant={form.category === "hot-hit" ? "primary" : "outline-secondary"}
                aria-pressed={form.category === "hot-hit"}
                onClick={() => setForm((current) => ({ ...current, category: "hot-hit" }))}
              >
                Hot hit
              </Button>
              <Button
                type="button"
                variant={form.category === "artifact" ? "primary" : "outline-secondary"}
                aria-pressed={form.category === "artifact"}
                onClick={() => setForm((current) => ({ ...current, category: "artifact" }))}
              >
                Hiện vật
              </Button>
            </div>

            <div className="artifact-editor-grid">
              <div className="artifact-image-field">
                <Form.Label htmlFor="artifact-image">Ảnh hiện vật</Form.Label>
                <label className={`artifact-image-upload ${form.imageData ? "has-image" : ""}`} htmlFor="artifact-image">
                  {form.imageData ? (
                    <img src={form.imageData} alt="Xem trước hiện vật" />
                  ) : (
                    <span><i className="bi bi-cloud-arrow-up" aria-hidden="true"></i>Up ảnh</span>
                  )}
                </label>
                <Form.Control
                  id="artifact-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                  className="visually-hidden"
                />
                <small>PNG, JPG hoặc WebP, tối đa 2 MB</small>
              </div>
              <Form.Group className="artifact-title-field" controlId="artifact-title">
                <Form.Label>Tên hiện vật</Form.Label>
                <Form.Control
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Nhập tên hiện vật"
                />
              </Form.Group>
            </div>

            <Form.Group className="artifact-description-field" controlId="artifact-description">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  maxLength={5000}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Nhập thông tin mô tả"
                />
            </Form.Group>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            <div className="artifact-form-actions">
              {editingId && <Button type="button" variant="outline-secondary" onClick={resetForm}>Hủy sửa</Button>}
              {editingId && (
                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={() => deleteArtifact(artifacts.find((item) => item.id === editingId))}
                >
                  Xóa hiện vật
                </Button>
              )}
              <Button type="submit" disabled={loading || !form.imageData} className="admin-submit">
                {loading ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu hiện vật"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={Boolean(detail)} onHide={() => setDetail(null)} centered>
        <Modal.Header closeButton><Modal.Title>{detail?.title}</Modal.Title></Modal.Header>
        <Modal.Body>
          {detail && <img className="artifact-detail-image" src={detail.imageData} alt={detail.title} />}
          <p className="mt-3 mb-0">{detail?.description || "Chưa có mô tả."}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ArtifactManager;