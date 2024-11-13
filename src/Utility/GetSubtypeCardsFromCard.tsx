import { useEffect, useState } from 'react';
import { ref as databaseRef, get } from "firebase/database";
import { database } from '../firebase';


//ARCHIVED. NOT USED BECAUSE SEPARATE CARDS TO DECKS WORKS NOW AND THIS GIVES TOO MANY HOOK ERRORS
const GetSubtypeCardsFromCard = (cardsToGetFrom: any , subCardType: string) => {
    const [subCardData, setSubCardData] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const fetchSubCardsInCard = async () => {
            let allCards: { [key: string]: any[] } = {};
            try {
                //get all cards from database
                const rootRef = databaseRef(database, '/');
                const snapshot = await get(rootRef);

                if (snapshot.exists()) {
                    const subcardsInCardKeyRef = databaseRef(database, `/${cardsToGetFrom.location}/${subCardType}`);
                    const subcardsSnapshot = await get(subcardsInCardKeyRef);
                    //getting cards in i.e. hints.
                    if (subcardsSnapshot.exists()) {
                        //all the subcards in the card
                        const subCardsInCard = subcardsSnapshot.val();
                        //get location of the card
                        const location = cardsToGetFrom.location;

                        // Split the location string by "/"
                        const parts = location.split("/");

                        // `deckKey` is the second part in the split array
                        const deckKey = parts[1]; // This will give you the `deckKey` value
                        const subCardData = Object.keys(subCardsInCard).map(subCardKey => ({
                            id: subCardKey,
                            location: `/${location}/${subCardType}/${subCardKey}`,  // Firebase location path
                            ...subCardsInCard[subCardKey] //rest of the data of the card
                        }));
                        //organize by deck type i.e. act, ego, prey
                        allCards[deckKey] = subCardData;
                    }

                } else {
                    console.log("No card data available");
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }

            setSubCardData(allCards);
        };

        fetchSubCardsInCard();
    }, []);

    return subCardData;
};

export default GetSubtypeCardsFromCard;