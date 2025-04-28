import {createContext} from 'react'

interface DeckInfo {
    [index: number]: {
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentCardsInDeck: number;
    }
}

interface DeckContextType {
    deckInfo: { [key: string]: DeckInfo };
    setDeckInfo: React.Dispatch<React.SetStateAction<{ [key: string]: DeckInfo }>>;
}


export const DeckContext = createContext<DeckContextType | null>(null);