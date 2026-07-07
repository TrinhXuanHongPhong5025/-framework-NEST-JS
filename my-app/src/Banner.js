import Carousel from "react-bootstrap/Carousel";

function Banner() {

  const images = [
    "https://i.pinimg.com/736x/b5/1a/e4/b51ae4d9ca9783b28318a74968f0f655.jpg",
    "https://i.pinimg.com/736x/e3/b7/e1/e3b7e1e02a4662aaeb137e7d5870b248.jpg",
    "https://i.pinimg.com/736x/ab/76/72/ab7672f5aee5ecd7d75b9fed6523f0bd.jpg",
    "https://i.pinimg.com/1200x/bb/54/da/bb54dab382de8fd28832d416461a8ccf.jpg",
  ];

  return (
    <div className="container mt-4">

      <Carousel
        fade
        interval={3000}
        pause="hover"
        className="banner-carousel"
      >

        {images.map((img, index) => (

          <Carousel.Item key={index}>

            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="banner-img"
            />

          </Carousel.Item>

        ))}

      </Carousel>

    </div>
  );
}

export default Banner;