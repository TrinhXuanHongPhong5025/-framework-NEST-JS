function Banner() {
  const images = [
    "https://i.pinimg.com/736x/59/14/c1/5914c12319192ebc065cf0b17e972551.jpg",
    "https://i.pinimg.com/736x/4f/1e/1f/4f1e1f8f5b4e6c061a28a200341b2375.jpg",
    "https://i.pinimg.com/736x/7e/17/56/7e1756b1ee103cefd9ee5a658aeeef6f.jpg",
    "https://i.pinimg.com/736x/4a/dc/f1/4adcf1724825ca251ba65cc75d8039d1.jpg",
    "https://i.pinimg.com/736x/0f/aa/d5/0faad5abf37eb40e2fa7c0743e0e0700.jpg",
    "https://i.pinimg.com/1200x/ec/a3/db/eca3db2c0cf6d1da0591b26e207ac9ab.jpg",
    "https://i.pinimg.com/736x/56/9e/48/569e48bfb51dce145473911556f5e1b3.jpg",
    "https://i.pinimg.com/736x/4b/b8/98/4bb89891dfcfd19d9810a9996d11d91f.jpg",
    "https://i.pinimg.com/736x/c5/9a/a3/c59aa3de629e9d190207c6d26048f7ca.jpg",
  ];

  // Nhân đôi mảng để chạy vô hạn
  const allImages = [...images, ...images];

  return (
    <section className="banner">

      <div className="banner-track">

        {allImages.map((img, index) => (

          <div className="banner-card" key={index}>

            <img src={img} alt="" />

          </div>

        ))}

      </div>

    </section>
  );
}

export default Banner;