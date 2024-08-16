import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DraggableCard from "../CardComponents/DraggableCard";
import SeparateCardsToDecks from "../Utility/SeparateCardsToDecks";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../styles/decks.css'

function Main() {
    //get all cards separated by types (with keys)
    const cardData = SeparateCardsToDecks();
    const navigate = useNavigate();

    const goToNewCardPage = () => {
        navigate('/new-card');
    }

    return (
        <div className="container">
        <nav>
            <Button onClick={goToNewCardPage}>Add New Card</Button>
        </nav>

        {Object.keys(cardData).map((deckType, index) => (
            <div key={index} className="deck-section">
                <h2>{deckType} Deck</h2>
                <div className="cards-container">
                    {cardData[deckType].map((card, cardIndex) => (
                        <DraggableCard key={cardIndex} card={card}  />
                    ))}
                </div>
            </div>
        ))}
    </div>
    );
}

export default Main;
