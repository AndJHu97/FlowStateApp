import { useEffect, useState } from 'react';
import { ref as databaseRef, get } from "firebase/database";
import { database } from '../firebase';

interface Card {
    id: string;
    location: string;
    subCards?: { [key: string]: any[] }; // Use this to hold subCards keyed by subCardType
}


interface AllCards {
    [deckType: string]: Card[]; // Each deck type maps to an array of Card objects
}


//if you include subCard, will save a subCard in the parameter of the card. i.e. Personal cards saved in Hint cards
const SeparateCardsByDecks = (cardType: string, subCardType: string) => {
    const [cardData, setCardData] = useState<AllCards>({});

    useEffect(() => {
        const fetchCardsByType = async () => {
            const allCards: AllCards = {}; // Use the defined AllCards type
            let subCards: { [key: string]: any[] } = {};
            try {
                //get all cards from database
                const rootRef = databaseRef(database, '/');
                const snapshot = await get(rootRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    //list of cards in the deck type. i.e act, ego, prey, etc.
                    const deckKeys = Object.keys(data);
                    //go through all types/decks i.e. act, ego, prey, etc.
                    for (const deckKey of deckKeys) {
                        //console.log(`Processing key: ${deckKey}`);
                        //get all the cards of category type with cardType
                        //i.e. hint. CardType = hint
                        const cardsInKeyRef = databaseRef(database, `/${deckKey}/${cardType}`);
                        const cardsSnapshot = await get(cardsInKeyRef);
                        //getting cards in i.e. hints.
                        if (cardsSnapshot.exists()) {
                            //all the cards in the deck
                            const cardsInDeckType = cardsSnapshot.val();

                            //if just grabbing a specific card signature in deck
                            if(subCardType === ""){
                                //get all the cards in deck with formatted data
                                //card key is the unique id
                                const cardData = Object.keys(cardsInDeckType).map(cardKey => ({
                                    id: cardKey,
                                    location: `/${deckKey}/${cardType}/${cardKey}`,  // Firebase location path
                                    deckLocation: `/${deckKey}/${cardType}`,
                                    ...cardsInDeckType[cardKey] //rest of the data of the card
                                }));
                                //organize by deck location in firebase
                                allCards[`/${deckKey}/${cardType}`] = cardData;
                            
                            //if grabbing a specific subcard type in each card type of deck. i.e. looking at deck type of act and grabbing all the personal cards of card type
                            //then subcard type of each personal cards inside of it like hint
                            }else{
                                // Prepare an array to hold formatted data based on subCardType
                                const subCardData: any[] = [];
                                // Prepare an array to hold formatted data based on subCardType
                                const formattedCards: any[] = [];
                                // Loop through each cardKey in cardsData.
                                Object.keys(cardsInDeckType).forEach(cardKey => {
                                    //the cards in Deck
                                    const cardInCardType = cardsInDeckType[cardKey];

                                    // Check if the subCardType exists in the current card
                                    if (cardInCardType[subCardType]) {
                                        // Loop through each key inside the subCardType object
                                        Object.keys(cardInCardType[subCardType]).forEach(subKey => {
                                            subCardData.push({
                                                id: subKey, // Assign an ID for the subKey
                                                location: `/${deckKey}/${cardType}/${cardKey}/${subKey}`,  // Firebase location path
                                                deckLocation: `/${deckKey}/${cardType}/${cardKey}`,
                                                ...cardInCardType[subCardType][subKey] // Use the data inside the subCardType
                                            });
                                        });
                                    }

                                    subCards[`/${deckKey}/${cardType}/${cardKey}`] = subCardData;

                                    //get all the cards in deck with formatted data
                                    const cardData = {
                                        id: cardKey,
                                        location: `/${deckKey}/${cardType}/${cardKey}`,  // Firebase location path
                                        deckLocation: `/${deckKey}/${cardType}`,
                                        subCards: subCards,
                                        ...cardsInDeckType[cardKey] //rest of the data of the card
                                    };
                                    // Push the formatted card data to the array
                                    formattedCards.push(cardData);
                                });

                                // Organize by deck type with filtered cards
                                allCards[`/${deckKey}/${cardType}`] = formattedCards;
                            }
                            
                            
                        } else {
                            console.log(`No data available for key: ${deckKey}`);
                        }
                    }
                } else {
                    console.log("No card data available");
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }

            setCardData(allCards);
        };

        fetchCardsByType();
    }, []);

    return cardData;
};

export default SeparateCardsByDecks;