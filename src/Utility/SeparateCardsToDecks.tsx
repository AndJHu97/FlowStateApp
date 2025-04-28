import { useEffect, useState } from 'react';
import { ref as databaseRef, get } from "firebase/database";
import { auth, database } from '../firebase';
import { onAuthStateChanged, User } from "firebase/auth";


interface Card {
    id: string;
    location: string;
    Personal?:{ [key: string]: Card }; 
    subCards?: { [key: string]: any[] }; // Use this to hold subCards keyed by subCardType
}


interface AllCards {
    [deckType: string]: Card[]; // Each deck type maps to an array of Card objects
}


//if you include subCard, will save a subCard in the parameter of the card. i.e. Personal cards saved in Hint cards
const SeparateCardsByDecks = async (cardType: string, subCardType: string): Promise<AllCards> => {
    const allCards: AllCards = {};

    try {
        const user: User = await new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) resolve(user);
                else reject(new Error("No user is logged in"));
            });
        });

        const rootRef = databaseRef(database, `users/${user.uid}/decks`);
        const snapshot = await get(rootRef);

        if (!snapshot.exists()) {
            console.log("No decks found.");
            return allCards;
        }

        const data = snapshot.val();
        const categoryKeys = Object.keys(data);

        for (const categoryKey of categoryKeys) {
            const cardsInCategory = data[categoryKey][cardType];

            if (!cardsInCategory) continue;

            allCards[categoryKey] = [];

            for (const cardID in cardsInCategory) {
                const card = cardsInCategory[cardID];

                // Check if subCards exist
                const subCards = card[subCardType] ? Object.values(card[subCardType]) : [];

                allCards[categoryKey].push({
                    id: cardID,
                    location: `users/${user.uid}/decks/${categoryKey}/${cardType}/${cardID}`,
                    ...card,
                    subCards: {
                        [subCardType]: subCards
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error fetching cards:", error);
    }

    return allCards;
};

export default SeparateCardsByDecks;