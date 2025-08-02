import React from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Card.css';

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
 
      <div className="card-container max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="card" >
          <div className = "card-img-container">
            <img src={image} 
            className="card-img-top object-cover w-full h-full" 
            alt={title} 
            />
          </div>
          <div className="card-body p-6 space-y-3">
            <h5 className="card-title text-xl font-bold text-gray-900">{title}</h5>
            <p className="card-text text-gray-700">{description}</p>
            <h6 className="card-title-small text-md font-semibold text-gray-800">Notes</h6>
            <p className="card-text text-gray-700">{note}</p>
            <p className="card-text text-sm text-gray-700">
              <span className="font-semibold">Category:</span> {categoryType}
            </p>
            <p className="card-text text-sm text-gray-700">
              <span className="font-semibold">Card Type:</span> {cardType}
            </p>
            <div className="container" style={{ alignItems: "center" }}>
              <a href="#" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Card;
