import React, { useState, useEffect, useMemo } from 'react';
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
    Personal?:{ [key: string]: Card }; 
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

    // Extract subCards and organize them into new decks
    //not working
    //DELETE BELOW. Processing with other way
    useEffect(() => {
        if (allPersonalCards) {
            const extractedSubCardDecks: AllCards = {};

            Object.entries(allPersonalCards).forEach(([deckType, cards]) => {
                cards.forEach((card) => {
                    if (card.subCards) {
                        Object.entries(card.subCards).forEach(([subCardType, subCards]) => {
                            if(subCards.length !== 0){
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
                    //I have to remake the deck location because my subCards (which has the location) isn't storing properly. subCards are storing all the subCards not only in the hint cards
                    const subCardLocation = randomHintCard.location + "/Personal/" + randomSubCardKey;
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
            {Object.keys(organizedHintCards).map((deckLocation, index) => (
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
            {organizedPersonalCards &&
                Object.keys(organizedPersonalCards).map((deckLocation, index) => (
                    <Deck
                        key={deckLocation}
                        cardData={cardDataWithSubCards}
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
