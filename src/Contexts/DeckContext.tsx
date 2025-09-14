import {createContext} from 'react'


interface Deck {
    id: string;
    categoryType: string;
    cardType: string;
    rect: DOMRect | null;
    maxCardsInDeck: number | null;
    maxCardsToLoad: number | null;
    currentNumOfCards: number;
    cardIDsOrderInDeck: string[];
    cards: Card[];
}

interface Card {
    id: string;
    path: string;
    categoryType: string; 
    cardType: string;
    description:string;
    image: string;
    note: string;
    title: string
}

interface DeckContextType {
    //This is all the decks organized by the key deck type
    //key is based on deck location
    decks: Deck[] ;
    setDeckInfo: React.Dispatch<React.SetStateAction<Deck[]>>;
}


export const DeckContext = createContext<DeckContextType | null>(null);