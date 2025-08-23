import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SeparateCardsToDecks from "../Utility/SeparateCardsToDecks";
import Deck from "../Components/DeckComponents/Deck";
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Nav } from 'react-bootstrap';
import '../styles/decks.css'
import { auth, database } from '../firebase';
import { onAuthStateChanged, User } from "firebase/auth";

import { ref as databaseRef, set } from "firebase/database";
//I think I set the deck context values in the decks, not here
import {DeckContext} from '../Contexts/DeckContext';
import NavBar from '../Components/NavBar';
import '../output.css';


interface DeckInfoInType {
    [index: number]:{
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentNumOfCardsInDeck: number;
        cardIDsOrderInDeck: string[];
    }
}

interface Card {
    id: string;
    location: string;
    categoryType?: string; 
    cardType?: string;
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
    const [deckInfo, setDeckInfo] = useState<{ [key: string]: DeckInfoInType }>({});
    const deckContext = useContext(DeckContext);

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

    const saveCurrentCards = async () => {
        //Get deck location/key from each decks with the Deck Info
        //Find the / until it is cardData[deckLocation][0].categoryType
        //Save to the this location with Selected_{cardType} (Make it if it doesn't exist)
        
        const user: User = await new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) resolve(user);
                else reject(new Error("No user is logged in"));
            });
        });


        for(const deckLocation in deckInfo){
            const deckInfoInType = deckInfo[deckLocation]
            for(const deckIndex in deckInfoInType)
            {
                const topCardKey = deckInfo[deckLocation][deckIndex].cardIDsOrderInDeck[0]
                
                if(!topCardKey) continue;

                const topCard = cardData[deckLocation]?.find(c => c.id === topCardKey);

                const categoryType = topCard?.categoryType;

                const cardType = topCard?.cardType;

                if(categoryType && cardType){
                    
                    var currentCardSaveLocation = `users/${user.uid}/decks/${categoryType}/Selected_${cardType}`;

                    //saving to firebase RT
                    const saveRef = databaseRef(database, currentCardSaveLocation);

                    await set(saveRef, topCardKey);

                    console.log(`Saved top card ${topCardKey} to ${currentCardSaveLocation}`);
                
                    
                }
                
            }
            
        }
        
    };

    return (
        <div>
            <NavBar></NavBar>
        <div className="container">
           
           
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-lg">
            Welcome to Flow State
            </h1>
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
                                isHoldingDailyCard = {true}
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
                                isHoldingDailyCard = {true}
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
                                    isHoldingDailyCard = {true}
                                />
                        ))}
                </div>

                {/* Button to log all deck orders */}
                <div className="mt-6">
                    <button
                    onClick={saveCurrentCards}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                    >
                    Save Decks
                    </button>
                </div>
            </DeckContext.Provider>
        </div>
        </div>
    );
    
}

export default Main;
