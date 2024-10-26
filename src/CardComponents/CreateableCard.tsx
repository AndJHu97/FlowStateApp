// Get attributes of card moving events from mouse clicks 
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

    const handleCardClick = () => {
        setShowForm(prevShowForm => !prevShowForm);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };
    
    return(
        <div>
            <div onClick={handleCardClick}>
                <Card
                    title={title}
                    image={image}
                    description={description}
                    note={note}
                    categoryType = {categoryType}
                    cardType = {cardType}
                />
            </div>
            <div>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                {showForm && (
                    <CardForm onClose={handleCloseForm} parentCardLocation={cardLocation} cardType = {"Personal"} categoryType = {categoryType} />
                )}
            </div>
        </div>
    );

}

export default CreateableCard;