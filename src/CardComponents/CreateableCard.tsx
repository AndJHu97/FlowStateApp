import React, { useRef, useState, useEffect } from 'react';
import Card from "./Card";
import CardForm from "./CardForm";

interface CardProps {
    title: string;
    image: any;
    description: string;
    note: string;
    categoryType: string;
    cardType: string;
    cardLocation: string;
}

const CreateableCard: React.FC<CardProps> = ({ title, image, description, note, categoryType, cardType, cardLocation }) => {
    const [showForm, setShowForm] = useState(false);

    // Handle double-click event to show form
    const handleCardDoubleClick = () => {
        setShowForm(true);  // Show the form on double-click
    };

    // Handle close form
    const handleCloseForm = () => {
        setShowForm(false);
    };

   
    return (
        <div>
            <div onDoubleClick={handleCardDoubleClick}>
                <Card
                    title={title}
                    image={image}
                    description={description}
                    note={note}
                    categoryType={categoryType}
                    cardType={cardType}
                />
            </div>
            {showForm && (
                <div className="card-form-overlay" onClick={() => handleCloseForm()}>
                    {/* The overlay background click will trigger closing */}
                    <div 
                        className="card-form-container" 
                        onClick={(e) => e.stopPropagation()}  // Stop click propagation inside the form
                    >
                        {/* The form content itself */}
                        <CardForm
                            onClose={handleCloseForm}
                            parentCardLocation={cardLocation}
                            cardType="Personal"
                            categoryType={categoryType}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateableCard;
