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
    const [deckPositions, setDeckPositions] = useState<{ [key: string]: DOMRect[] }>({});

    const goToNewCardPage = () => {
        navigate('/new-card');
    }

    const handleDeckPositionChange = (deckType: string, rect: DOMRect) => {
        setDeckPositions((prevPositions) => ({
            ...prevPositions,
            [deckType]: prevPositions[deckType] ? [...prevPositions[deckType], rect] : [rect]
        }));
    };

    // Log deckPositions whenever it changes
    useEffect(() => {
        console.log("Updated deck positions:", deckPositions);
    }, [deckPositions]);

    return (
        <div className="container">
        <nav>
            <Button onClick={goToNewCardPage}>Add New Card</Button>
        </nav>

        {Object.keys(cardData).map((deckType, index) => (
            <Deck key={deckType} cardData = {cardData} deckType = {deckType} index = {index} deckPositions={deckPositions} onDeckPositionChange={handleDeckPositionChange}/>
        ))}
    </div>
    );
}

export default Main;
