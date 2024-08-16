import { useEffect, useState } from 'react';
import { ref as databaseRef, get } from "firebase/database";
import { database } from '../firebase';

const SeparateCardsByDecks = () => {
    const [cardData, setCardData] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchCardsByType = async () => {
            let allCards: { [key: string]: any[] } = {};
            try {
                const rootRef = databaseRef(database, '/');
                const snapshot = await get(rootRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const keys = Object.keys(data);

                    for (const key of keys) {
                        console.log(`Processing key: ${key}`);

                        const cardsInKeyRef = databaseRef(database, `/${key}`);
                        const cardsSnapshot = await get(cardsInKeyRef);

                        if (cardsSnapshot.exists()) {
                            const cardsData = cardsSnapshot.val();
                            const formattedData = Object.keys(cardsData).map(cardKey => ({
                                id: cardKey,
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