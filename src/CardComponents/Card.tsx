import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardProps {
  title: string;
  image: any;
  description: string;
  note: string;
  type: string;
}



const Card: React.FC<CardProps> = ({ title, image, description, note, type }) => {
  return (
 
      <div className="card-container" style={{ border: '5px solid #ccc', borderRadius: '5px', padding: '10px', display: 'inline-block' }}>
        <div className="card" style={{ width: '200px', border: '0px' }}>
          <div style={{ marginBottom: '10px' }}>
            <img src={image} className="card-img-top" alt={title} />
          </div>
          <div className="card-body" style={{ height: "250px" }}>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <h6 className="card-title">Notes</h6>
            <p className="card-text">{note}</p>
            <h6 className="card-title">Type</h6>
            <p className="card-text">{type}</p>
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
