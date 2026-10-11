import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";

const featuredImages = [
    "https://i.pinimg.com/736x/4b/91/59/4b9159fd1b7d8851b72e8af5653b37fc.jpg",
    "https://i.pinimg.com/736x/59/14/c1/5914c12319192ebc065cf0b17e972551.jpg",
    "https://i.pinimg.com/1200x/40/ec/50/40ec50b9d6a2b46ee8af0ecee84e74d9.jpg",
    "https://i.pinimg.com/736x/8c/03/32/8c0332e348c7b9747737d9062fd130cc.jpg",
    "https://i.pinimg.com/736x/7e/17/56/7e1756b1ee103cefd9ee5a658aeeef6f.jpg",
    "https://i.pinimg.com/736x/4a/dc/f1/4adcf1724825ca251ba65cc75d8039d1.jpg",
    "https://i.pinimg.com/736x/0f/aa/d5/0faad5abf37eb40e2fa7c0743e0e0700.jpg",
    "https://i.pinimg.com/1200x/ec/a3/db/eca3db2c0cf6d1da0591b26e207ac9ab.jpg",
    "https://i.pinimg.com/736x/f9/3b/49/f93b49de5603128c79c788e00b8e75c8.jpg",
    "https://i.pinimg.com/736x/56/9e/48/569e48bfb51dce145473911556f5e1b3.jpg",
    "https://i.pinimg.com/736x/4b/b8/98/4bb89891dfcfd19d9810a9996d11d91f.jpg",
    "https://i.pinimg.com/736x/c5/9a/a3/c59aa3de629e9d190207c6d26048f7ca.jpg",
    "https://i.pinimg.com/736x/b9/f0/3f/b9f03fe5deb0d013b0e03e383439a6c3.jpg",
    "https://i.pinimg.com/control1/1200x/9c/b2/9f/9cb29fd88fe356679fb41cab2b1a6dde.jpg",
    "https://i.pinimg.com/736x/a0/ed/1b/a0ed1bf68cea76d1b313421620b0d836.jpg",
    "https://i.pinimg.com/736x/7a/a9/91/7aa991f8c8b76057e8b38c2e8cf75a78.jpg",
];

function Banner({ artifacts, favorites, isAdmin, onEditArtifact, onToggleFavorite }) {
  const displayItems = useMemo(() => {
    const legacyItems = [...featuredImages, ...featuredImages].map((image, index) => ({
      id: `gallery-${index}`,
      image,
      favoriteKey: image,
      title: "Hiện vật",
      description: "",
    }));
    const savedItems = artifacts.map((artifact) => ({
        id: `artifact-${artifact.id}`,
        image: artifact.imageData,
        favoriteKey: `artifact:${artifact.id}`,
        title: artifact.title,
        description: artifact.description,
        category: artifact.category,
        artifact,
      }));
    const categoryItems = [...savedItems, ...legacyItems];
    return [...categoryItems, ...categoryItems.map((item) => ({ ...item, id: `${item.id}-copy` }))];
  }, [artifacts]);

  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openImage = (item) => {
    setSelectedItem(item);
    setShow(true);
  };

  const closeImage = () => {
    setShow(false);
  };

  return (
    <>

      <section className="banner">
        <div className="banner-track">

          {displayItems.length > 0 ? displayItems.map((item) => (

            <div
              className="banner-card"
              key={item.id}
              onClick={() => openImage(item)}
            >

              <img src={item.image} alt={item.title} />
              {item.description && <span className="artifact-card-title">{item.title}</span>}

              <button
                type="button"
                className={`artifact-favorite ${favorites.includes(item.favoriteKey) ? "is-favorite" : ""}`}
                aria-label={favorites.includes(item.favoriteKey) ? "Bỏ yêu thích hiện vật" : "Yêu thích hiện vật"}
                aria-pressed={favorites.includes(item.favoriteKey)}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item.favoriteKey);
                }}
              >
                <i className={`bi ${favorites.includes(item.favoriteKey) ? "bi-heart-fill" : "bi-heart"}`} aria-hidden="true"></i>
              </button>

              {isAdmin && item.category === "hot-hit" && item.artifact && (
                <button
                  type="button"
                  className="hot-hit-edit"
                  aria-label={`Sửa ${item.title}`}
                  title="Sửa Hot hit"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditArtifact(item.artifact);
                  }}
                >
                  <i className="bi bi-flag-fill" aria-hidden="true"></i>
                </button>
              )}

            </div>

          )) : (
            <p className="artifact-category-empty">Chưa có hiện vật trong danh mục này.</p>
          )}

        </div>

      </section>

      <Modal
        show={show}
        onHide={closeImage}
        centered
        size="xl"
        className="image-modal artifact-profile-modal"
      >

        <Modal.Body className="artifact-profile-body">

          {selectedItem && (
            <>
              <img src={selectedItem.image} alt={selectedItem.title} className="popup-image" />
              <div className="artifact-detail-copy">
                <h3>{selectedItem.title}</h3>
                {selectedItem.description && <p>{selectedItem.description}</p>}
              </div>
              {isAdmin && selectedItem.artifact && (
                <button
                  type="button"
                  className="artifact-detail-edit"
                  aria-label={`Sửa thông tin ${selectedItem.title}`}
                  title="Sửa thông tin và ảnh"
                  onClick={() => onEditArtifact(selectedItem.artifact)}
                >
                  <i className="bi bi-wrench-adjustable" aria-hidden="true"></i>
                  <span>Sửa thông tin</span>
                </button>
              )}
            </>
          )}

        </Modal.Body>

      </Modal>

    </>
  );
}

export default Banner;