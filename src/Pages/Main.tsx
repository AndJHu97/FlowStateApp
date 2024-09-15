import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeparateCardsToDecks from "../Utility/SeparateCardsToDecks";
import Deck from "../Deck/Deck";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../styles/decks.css'

interface DeckInfo {
    [index: number]:{
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentCardsInDeck: number;
    }
    
}

function Main() {
    //get all cards separated by types (with keys)
    const cardData = SeparateCardsToDecks();
    const navigate = useNavigate();
    
    //const [deckCallbacks, setDeckCallbacks] = useState<{ [key: string]: (cardId: string) => void }>({});
    //const [deckPositions, setDeckPositions] = useState<{ [key: string]: DOMRect[] }>({});

    const [deckInfo, setDeckInfo] = useState<{ 
        [key: string]: DeckInfo
    }>({});
    const goToNewCardPage = () => {
        navigate('/new-card');
    }

    const handleDeckPositionChange = (deckType: string, index: number, rect: DOMRect, currentCardsInDeck: number, maxCardsInDeck: number | null) => {
        setDeckInfo(prevPositions => {
            const currentDeckInfo = prevPositions[deckType] || {};
            
            //retrieve the index of the specific deck of that type (like deck 2 of Ego deck)
            const currentDeck = currentDeckInfo[index] || {
                rect: null,
                currentCardsInDeck: currentCardsInDeck,
                maxCardsInDeck: maxCardsInDeck
            }

            return {
                ...prevPositions,
                [deckType]: {
                    ...currentDeckInfo,
                    [index]: {
                    ...currentDeck,
                    rect: rect, // Update the rect array
                    currentCardsInDeck: currentCardsInDeck, // Update the currentCardsInDeck
                    maxCardsInDeck: maxCardsInDeck // Update the maxCardsInDeck
                    }
                }
            };
        });
    };

    const onDeckCurrentNumberChange = (deckType: string, index: number, currentCardsInDeck: number) => {
        setDeckInfo(prevPositions =>{
            const currentDeckInfo = prevPositions[deckType]
            const currentDeck = currentDeckInfo[index]
            return {
                ...prevPositions,
                [deckType]: {
                    ...currentDeckInfo,
                    [index]: {
                    ...currentDeck,
                    currentCardsInDeck: currentCardsInDeck, // Update the currentCardsInDeck
                    }
                }
            };
        })
    }

    return (
        <div className="container">
        <nav>
            <Button onClick={goToNewCardPage}>Add New Card</Button>
        </nav>

        {Object.keys(cardData).map((deckType, index) => (
            <Deck key={deckType} cardData = {cardData} deckType = {"Ego"} maxCardsInDeck={3} index = {index} onDeckCurrentNumberChange={onDeckCurrentNumberChange} deckInfos={deckInfo} onDeckPositionChange={handleDeckPositionChange}/>
        ))}
    </div>
    );
}

export default Main;
