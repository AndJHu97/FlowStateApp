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

interface Card {
    id: string;
    location: string;
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
    const [subCardDecks, setSubCardDecks] = useState<AllCards | null>(null); // To store subCard decks
    const navigate = useNavigate();

    const goToNewCardPage = () => {
        navigate('/new-card');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const hintCards = await SeparateCardsToDecks('Hint', '');
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

    // Extract subCards and organize them into new decks
    //not working
    useEffect(() => {
        if (allPersonalCards) {
            const extractedSubCardDecks: AllCards = {};

            Object.entries(allPersonalCards).forEach(([deckType, cards]) => {
                cards.forEach((card) => {
                    if (card.subCards) {
                        Object.entries(card.subCards).forEach(([subCardType, subCards]) => {
                            if(subCards.length != 0){
                                if (!extractedSubCardDecks[subCardType]) {
                                    extractedSubCardDecks[subCardType] = [];
                                }
                                console.log("subCardType: " + subCardType);
                                extractedSubCardDecks[subCardType].push(...subCards);
                            }
                            
                        });
                    }
                });
            });

            setSubCardDecks(extractedSubCardDecks);
        }
    }, [allPersonalCards]);

    useEffect(() =>{
        console.log("sub cards: " + subCardDecks);
    }, [subCardDecks])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cardData || !allPersonalCards) {
        return <div>No card data available</div>;
    }

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

            {/* Render main card decks */}
            {Object.keys(cardData).map((deckLocation, index) => (
                <Deck
                    key={deckLocation}
                    cardData={cardData}
                    deckID={deckLocation}
                    maxCardsInDeck={1}
                    maxCardsToLoad={1}
                    deckIndex={index}
                    onDeckCurrentNumberChange={onDeckCurrentNumberChange}
                    deckInfos={deckInfo}
                    onDeckPositionChange={handleDeckPositionChange}
                />
            ))}

            {/* Render subCard decks */}
            {subCardDecks &&
                Object.keys(subCardDecks).map((deckLocation, index) => (
                    <Deck
                        key={deckLocation}
                        cardData={subCardDecks}
                        deckID={deckLocation}
                        maxCardsInDeck={2}
                        maxCardsToLoad={2}
                        deckIndex={index}
                        onDeckCurrentNumberChange={onDeckCurrentNumberChange}
                        deckInfos={deckInfo}
                        onDeckPositionChange={handleDeckPositionChange}
                    />
                ))}
        </div>
    );
}

export default Main;
