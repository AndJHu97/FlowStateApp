import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SeparateCardsToDecks from "../Utility/SeparateCardsToDecks";
import Deck from "../Components/DeckComponents/Deck";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../styles/decks.css'
import {DeckContext} from '../Contexts/DeckContext';

interface DeckInfo {
    [index: number]:{
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentCardsInDeck: number;
    }
}

interface Card {
    id: string;
    location: string;
    Personal?:{ [key: string]: any }; 
    subCards?: { [key: string]: any[] }; // Use this to hold subCards keyed by subCardType
}

interface AllCards {
    [deckType: string]: Card[]; // Each deck type maps to an array of Card objects
}

function Main() {
    const [cardData, setCardData] = useState<AllCards | null>(null);
    const [allPersonalCards, setAllPersonalCards] = useState<AllCards | null>(null);
    const [loading, setLoading] = useState(true);
    const [deckInfo, setDeckInfo] = useState<{ [key: string]: DeckInfo }>({});
    const navigate = useNavigate();

    const goToNewCardPage = () => {
        navigate('/new-card');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const hintCards = await SeparateCardsToDecks('Hint', 'Personal');
                setCardData(hintCards);
                const personalCards = await SeparateCardsToDecks('Hint', 'Personal');
                setAllPersonalCards(personalCards);
            } catch (error) {
                console.error('Error fetching card data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("Card Data: ", cardData);
    }, [cardData])


    //1. Get 1 random hint card
    //2. Get the personal cards from the 1 hint card
    //3. Choose one personal card from it
    //4. Save them all into its variable

    //this is for subcards. get the cardDatawithSubcards
    const [organizedHintCards, organizedPersonalCards, cardDataWithSubCards] = useMemo(() => {
        if (!cardData) return [{}, {}, {} as Record<string, any[]>]; // Ensure a default value for cardDataWithSubCards
        const hintCards: Record<string, Card> = {};
        const personalCards: Record<string, Card> = {};
        const allCardData: Record<string, any[]> = {}; // Default structure matches the expected type
    
        Object.entries(cardData).forEach(([deckType]) => {
            const cards = cardData[deckType];
            const randomHintCard = cards[Math.floor(Math.random() * cards.length)];
            hintCards[deckType] = randomHintCard;
            console.log("random hint card: ", randomHintCard);
            const subCardsInHintCard = randomHintCard?.Personal;
            if (subCardsInHintCard) {
                //if there are subcards for the hint cards
                if(Object.keys(subCardsInHintCard).length > 0){
                    const subCardsKeys = Object.keys(subCardsInHintCard);
                    const randomSubCardKey = subCardsKeys[Math.floor(Math.random() * subCardsKeys.length)];
                    const randomSubCard = subCardsInHintCard[randomSubCardKey];
                
                    //deck location or key
                    console.log("Sub card data: ", subCardsInHintCard[randomSubCardKey]);
                    const subCardLocation = randomSubCard.categoryType + "/" + randomSubCard.cardType;
                    // Ensure the allCardData structure is correctly initialized
                    if (!allCardData[subCardLocation]) {
                        allCardData[subCardLocation] = [];
                    }

                    // Prevent adding duplicates (which keeps occuring for some reason)
                    if (personalCards[subCardLocation]) {
                        console.log("SubCardLocation already exists, skipping:", subCardLocation);
                        return; // Skip adding this subcard
                    } else {
                        // If subCardLocation does not exist, add the subcard
                        console.log("Sub card location: ", subCardLocation);
                        personalCards[subCardLocation] = randomSubCard;
                    }

                    allCardData[subCardLocation].push(randomSubCard);
                }

                
                
                
            }
        });
    
        console.log("Organized Personal Cards:", personalCards); // Debug here
        console.log("All Card Data with SubCards:", allCardData); // Debug here
    
        return [hintCards, personalCards, allCardData];
    }, [cardData]);
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cardData || !allPersonalCards) {
        return <div>No card data available</div>;
    }


    //Don't need with deck context API
    const handleDeckPositionChange = (deckID: string, index: number, rect: DOMRect, currentCardsInDeck: number, maxCardsInDeck: number | null) => {
        setDeckInfo((prevPositions) => {
            const currentDeckInfo = prevPositions[deckID] || {};

            return {
                ...prevPositions,
                [deckID]: {
                    ...currentDeckInfo,
                    [index]: {
                        rect,
                        currentCardsInDeck,
                        maxCardsInDeck,
                    },
                },
            };
        });
    };

    //Need to work with deck context API
    //I believe finished and don't need anymore
    const onDeckCurrentNumberChange = (deckID: string, deckIndex: number, currentCardsInDeck: number) => {
        setDeckInfo((prevPositions) => {
            const currentDeckInfo = prevPositions[deckID] || {};
            return {
                ...prevPositions,
                [deckID]: {
                    ...currentDeckInfo,
                    [deckIndex]: {
                        ...currentDeckInfo[deckIndex],
                        currentCardsInDeck,
                    },
                },
            };
        });
    };
    
  

    return (
        <div className="container">
            <nav>
                <Button onClick={goToNewCardPage}>Add New Card</Button>
            </nav>

            <DeckContext.Provider value = {{deckInfo, setDeckInfo}}>

                <div className="decks-container"> {/* Wrap all decks */}
                    {Object.keys(organizedHintCards).map((deckLocation, index) => (
                            <Deck
                                key={deckLocation}
                                cardData={cardData}
                                deckID={deckLocation}
                                deckName="Daily"
                                maxCardsInDeck={4}
                                maxCardsToLoad={3}
                                deckIndex={index}
                                //onDeckCurrentNumberChange={onDeckCurrentNumberChange}
                                //deckInfos={deckInfo}
                                //onDeckPositionChange={handleDeckPositionChange}
                            />
                    ))}

                    {Object.keys(organizedHintCards).map((deckLocation, index) => (
                        
                            <Deck
                                key={deckLocation}
                                cardData={cardData}
                                deckID={deckLocation}
                                deckName="Test"
                                maxCardsInDeck={3}
                                maxCardsToLoad={3}
                                deckIndex={index + 2}
                                //onDeckCurrentNumberChange={onDeckCurrentNumberChange}
                                //deckInfos={deckInfo}
                                //onDeckPositionChange={handleDeckPositionChange}
                            />
                    ))}
                </div>

                <div className="decks-container"> {/* Wrap all personal decks */}
                    {organizedPersonalCards &&
                        Object.keys(organizedPersonalCards).map((deckLocation, index) => (
                            
                                <Deck
                                    key={deckLocation}
                                    cardData={cardDataWithSubCards}
                                    deckID={deckLocation}
                                    deckName="Past"
                                    maxCardsInDeck={2}
                                    maxCardsToLoad={2}
                                    deckIndex={index}
                                    //onDeckCurrentNumberChange={onDeckCurrentNumberChange}
                                    //deckInfos={deckInfo}
                                    //onDeckPositionChange={handleDeckPositionChange}
                                />
                        ))}
                </div>
            </DeckContext.Provider>
        </div>

    );
    
}

export default Main;
