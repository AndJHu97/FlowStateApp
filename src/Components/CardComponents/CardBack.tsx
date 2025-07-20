import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Card.css';

interface CardBackProps {
  image: string; // path or URL to the image
  altText?: string;
}

const CardBack: React.FC<CardBackProps> = ({ image, altText = "Card back" }) => {
  return (
    
    <div className="card-back-container">
  
      <img src={image} alt={altText} className="card-back-image" />
    </div>

  );
};

export default CardBack;
