import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeparateCardsToDecks from "../Utility/SeparateCardsToDecks";
import Deck from "../Deck/Deck";
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
            <Deck cardData = {cardData} deckType = {deckType} index = {index}/>
        ))}
    </div>
    );
}

export default Main;
