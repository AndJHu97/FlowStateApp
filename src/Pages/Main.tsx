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
    // Define the type of card data you're expecting
    const cardData = SeparateCardsToDecks('Hint', '');
    //this saves all the personal cards in parameter subKey
    var allPersonalCards = SeparateCardsToDecks('Hint', 'Personal')
    const navigate = useNavigate();

    // After defining allPersonalCards
    const firstDeckType = Object.keys(allPersonalCards)[0]; // Get the first deck type
    const firstCard = allPersonalCards[firstDeckType]?.[0]; // Get the first card

    // Retrieve the Personal key if it exists. In future need to find better way to access these
    const personalKey = firstCard?.subCards;
    
    //const [deckCallbacks, setDeckCallbacks] = useState<{ [key: string]: (cardId: string) => void }>({});
    //const [deckPositions, setDeckPositions] = useState<{ [key: string]: DOMRect[] }>({});

    const [deckInfo, setDeckInfo] = useState<{ 
        [key: string]: DeckInfo
    }>({});
    const goToNewCardPage = () => {
        navigate('/new-card');
    }

    //I think this stores all the position of all the decks
    const handleDeckPositionChange = (deckID: string, index: number, rect: DOMRect, currentCardsInDeck: number, maxCardsInDeck: number | null) => {
        setDeckInfo(prevPositions => {
            const currentDeckInfo = prevPositions[deckID] || {};
            
            //retrieve the index of the specific deck of that type (like deck 2 of Ego deck)
            const currentDeck = currentDeckInfo[index] || {
                rect: null,
                currentCardsInDeck: currentCardsInDeck,
                maxCardsInDeck: maxCardsInDeck
            }

            return {
                ...prevPositions,
                [deckID]: {
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

    //cards in the deck
    const onDeckCurrentNumberChange = (deckID: string, index: number, currentCardsInDeck: number) => {
        setDeckInfo(prevPositions =>{
            const currentDeckInfo = prevPositions[deckID]
            const currentDeck = currentDeckInfo[index]
            return {
                ...prevPositions,
                [deckID]: {
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

        {Object.keys(cardData).map((deckLocation, index) => (
            <Deck key={deckLocation} cardData = {cardData} deckID = {deckLocation} maxCardsInDeck={1} maxCardsToLoad={1} index = {index} onDeckCurrentNumberChange={onDeckCurrentNumberChange} deckInfos={deckInfo} onDeckPositionChange={handleDeckPositionChange}/>
        ))}

        {Object.keys(cardData).map((deckType, index) => (
            <Deck key={deckType} cardData = {cardData} deckID = {deckType} maxCardsInDeck={2} maxCardsToLoad={1} index = {index + 2} onDeckCurrentNumberChange={onDeckCurrentNumberChange} deckInfos={deckInfo} onDeckPositionChange={handleDeckPositionChange}/>
        ))}

        {personalKey && Object.keys(personalKey).map((deckType, index) => (
            <Deck key={deckType} cardData={personalKey} deckID={deckType} maxCardsInDeck={1} maxCardsToLoad={1} index={index} onDeckCurrentNumberChange={onDeckCurrentNumberChange} deckInfos={deckInfo} onDeckPositionChange={handleDeckPositionChange}/>
        ))}

        {personalKey && Object.keys(personalKey).map((deckType, index) => (
            <Deck key={deckType} cardData={personalKey} deckID={deckType} maxCardsInDeck={3} maxCardsToLoad={2} index={index} onDeckCurrentNumberChange={onDeckCurrentNumberChange} deckInfos={deckInfo} onDeckPositionChange={handleDeckPositionChange}/>
        ))}
        
    </div>
    );
}

export default Main;
