import { useEffect, useState } from 'react';
import { ref as databaseRef, get } from "firebase/database";
import { database } from '../firebase';

const SeparateCardsByDecks = (cardType: string) => {
    const [cardData, setCardData] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchCardsByType = async () => {
            let allCards: { [key: string]: any[] } = {};
            try {
                //get all cards from database
                const rootRef = databaseRef(database, '/');
                const snapshot = await get(rootRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    //list of cards in the specific type
                    const keys = Object.keys(data);
                    //go through all types/decks
                    for (const key of keys) {
                        console.log(`Processing key: ${key}`);
                        //get all the cards of category type
                        const cardsInKeyRef = databaseRef(database, `/${key}/${cardType}`);
                        const cardsSnapshot = await get(cardsInKeyRef);
                        //getting cards of the type
                        if (cardsSnapshot.exists()) {
                            //all the data in the deck
                            const cardsData = cardsSnapshot.val();
                            //get all the cards in deck with formatted data
                            const formattedData = Object.keys(cardsData).map(cardKey => ({
                                id: cardKey,
                                location: `/${key}/${cardType}/${cardKey}`,  // Firebase location path
                                ...cardsData[cardKey]
                            }));

                            allCards[key] = formattedData;
                        } else {
                            console.log(`No data available for key: ${key}`);
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