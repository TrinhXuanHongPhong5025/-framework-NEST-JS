import Carousel from "react-bootstrap/Carousel";

function Banner() {
  return (
    <Carousel>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://picsum.photos/1200/300"
          alt=""
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://picsum.photos/1200/301"
          alt=""
        />
      </Carousel.Item>

    </Carousel>
  );
}

export default Banner;