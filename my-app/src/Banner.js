import { useState } from "react";
import { Modal } from "react-bootstrap";

function Banner() {

  const images = [
    "https://i.pinimg.com/736x/cf/2c/71/cf2c718361feb821d9e714b0d1d8f531.jpg",
    "https://i.pinimg.com/736x/59/14/c1/5914c12319192ebc065cf0b17e972551.jpg",
    "https://i.pinimg.com/736x/4f/1e/1f/4f1e1f8f5b4e6c061a28a200341b2375.jpg",
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

  const allImages = [...images, ...images];

  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openImage = (img) => {
    setSelectedImage(img);
    setShow(true);
  };

  const closeImage = () => {
    setShow(false);
  };

  return (
    <>

      <section className="banner">

        <div className="banner-track">

          {allImages.map((img, index) => (

            <div
              className="banner-card"
              key={index}
              onClick={() => openImage(img)}
            >

              <img src={img} alt="" />

            </div>

          ))}

        </div>

      </section>

      <Modal
        show={show}
        onHide={closeImage}
        centered
        size="xl"
        className="image-modal"
      >

        <Modal.Body>

          <img
            src={selectedImage}
            alt=""
            className="popup-image"
          />

        </Modal.Body>

      </Modal>

    </>
  );
}

export default Banner;