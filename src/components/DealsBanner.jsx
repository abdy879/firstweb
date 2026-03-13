import { useState, useEffect } from "react";
import "./DealsBanner.css";

function DealsBanner() {
  const images = [
    "/images/deal1.png",
    "/images/deal2.png",
    "/images/deal3.png",
    "/images/deal4.png",
    "/images/deal5.png",
   
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3; // number of images to show at a time

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex(prev => (prev + visibleCount) % images.length);
    }, 3000); // 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Get 3 images at a time, wrap around if needed
  const getVisibleImages = () => {
    const visibleImages = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (startIndex + i) % images.length;
      visibleImages.push(images[idx]);
    }
    return visibleImages;
  };

  return (
    <section className="deals-banner">
      <div className="slider">
        {getVisibleImages().map((img, i) => (
          <img key={i} src={img} alt="deal" className="deal-image" />
        ))}
      </div>
    </section>
  );
}

export default DealsBanner;