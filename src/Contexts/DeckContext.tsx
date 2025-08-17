import {createContext} from 'react'

//Deck info is deck info with the same deck types. i.e. might have 2 different act decks and the index would indicate which deck it is
interface DeckInfoInType {
    [index: number]: {
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentNumOfCardsInDeck: number;
        cardIDsOrderInDeck: number[];
    }
}

interface DeckContextType {
    //This is all the decks organized by the key deck type
    deckInfo: { [key: string]: DeckInfoInType };
    setDeckInfo: React.Dispatch<React.SetStateAction<{ [key: string]: DeckInfoInType }>>;
}


export const DeckContext = createContext<DeckContextType | null>(null);