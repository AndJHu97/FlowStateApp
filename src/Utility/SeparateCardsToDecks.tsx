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
const SeparateCardsByDecks = async (cardType: string, subCardType: string) : Promise<AllCards> => {
    const allCards: AllCards = {};

    try {
        let subCards: { [key: string]: any[] } = {};
        
        //get all cards from database
        const rootRef = databaseRef(database, '/');
        const snapshot = await get(rootRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            //list of cards in the deck type. i.e act, ego, prey, etc.
            const categoryKeys = Object.keys(data);
            //go through all types/decks i.e. act, ego, prey, etc.
            for (const categoryKey of categoryKeys) {
                //console.log(`Processing key: ${categoryKey}`);
                //get all the cards of category type with cardType
                //i.e. hint. CardType = hint
                const cardsInKeyRef = databaseRef(database, `/${categoryKey}/${cardType}`);
                const cardsSnapshot = await get(cardsInKeyRef);
                //getting cards in i.e. hints.
                if (cardsSnapshot.exists()) {
                    //all the cards in the deck
                    const cardsInDeckType = cardsSnapshot.val();

                    //if not grabbing a subcard i.e. personal
                    if(subCardType === ""){
                        //get all the cards in deck with formatted data
                        //card key is the unique id
                        const cardData = Object.keys(cardsInDeckType).map(cardKey => ({
                            id: cardKey,
                            location: `/${categoryKey}/${cardType}/${cardKey}`,  // Firebase location path
                            deckLocation: `/${categoryKey}/${cardType}`,
                            ...cardsInDeckType[cardKey] //rest of the data of the card
                        }));
                        console.log("accessing the non-sub cards: " + cardType);
                        //organize by deck location in firebase
                        allCards[`/${categoryKey}/${cardType}`] = cardData;
                    
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
                                        location: `/${categoryKey}/${cardType}/${cardKey}/${subCardType}/${subKey}`,  // Firebase location path
                                        deckLocation: `/${categoryKey}/${cardType}/${cardKey}/${subCardType}`,
                                        ...cardInCardType[subCardType][subKey] // Use the data inside the subCardType
                                    });
                                });
                            }
                            console.log("accessing the sub cards: " + subCardType);
                            //thie is the location of the subcard deck (i.e. inside a hint card it is under personal)
                            subCards[`/${categoryKey}/${cardType}/${cardKey}/${subCardType}`] = subCardData;

                            //get all the cards in deck with formatted data
                            const cardData = {
                                id: cardKey,
                                location: `/${categoryKey}/${cardType}/${cardKey}`,  // Firebase location path
                                deckLocation: `/${categoryKey}/${cardType}`,
                                subCards: subCards,
                                ...cardsInDeckType[cardKey] //rest of the data of the card
                            };
                            // Push the formatted card data to the array
                            formattedCards.push(cardData);
                        });
                        

                        // Organize by deck type (location of deck) with filtered cards
                        allCards[`/${categoryKey}/${cardType}`] = formattedCards;
                    }
                    
                    
                } else {
                    console.log(`No data available for key: ${categoryKey}`);
                }
            }
        } else {
            console.log("No card data available");
        }
    }catch (error) {
        console.error("Error fetching cards by type: ", error);
        throw new Error("Failed to fetch cards.");
    }
    console.log("all cards " + allCards);
    return allCards;
};

export default SeparateCardsByDecks;