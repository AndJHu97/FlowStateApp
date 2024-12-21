import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Card.css';

interface CardProps {
  title: string;
  image: any;
  description: string;
  note: string;
  categoryType: string;
  cardType: string;
}



const Card: React.FC<CardProps> = ({ title, image, description, note, categoryType, cardType }) => {
  return (
 
      <div className="card-container">
        <div className="card" >
          <div className = "card-img-container">
            <img src={image} 
            className="card-img-top" 
            alt={title} 
            />
          </div>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <h6 className="card-title-small">Notes</h6>
            <p className="card-text">{note}</p>
            <p className="card-text">Category Type: {categoryType}</p>
            <p className="card-text">Card Type: {cardType}</p>
            <div className="container" style={{ alignItems: "center" }}>
              <a href="#" className="btn btn-primary">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Card;
