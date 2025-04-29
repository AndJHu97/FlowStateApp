import React, { useState, useRef, useEffect, useContext } from 'react';
import CreateableCard from "../CardComponents/CreateableCard";
import LoadingArea from "./CardLoadingArea";
import '../../styles/Main.css'
import DraggableCard from '../CardComponents/DraggableCard';
import { DeckContext } from '../../Contexts/DeckContext';

interface DeckInfo {
    [index: number]:{
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentCardsInDeck: number;
    }   
}



interface DeckProps{
    deckID: string,
    deckIndex: number,
    deckName: string,
    cardData: { [key: string]: any[]}
    //deckInfos: { [key: string]: DeckInfo }; // Use the DeckInfo interface here
    maxCardsInDeck?: number | null;
    maxCardsToLoad?: number | null;
    //onDeckPositionChange: (deckType: string, index: number, rect: DOMRect, currentCardsInDeck: number, maxCardsInDeck: number | null) => void;
    onDeckCurrentNumberChange: (deckType: string, index: number, currentCardsInDeck: number) => void;
}

const Deck: React.FC<DeckProps> = (({cardData, deckID: deckLocation, deckIndex, deckName, maxCardsInDeck = null, maxCardsToLoad = null, onDeckCurrentNumberChange}) =>
    {
        const deckRef = useRef<HTMLDivElement>(null);

        const localMaxCardsToLoad = maxCardsToLoad === null ? cardData[deckLocation].length : maxCardsToLoad;
        const limitedMaxCardsToLoad = maxCardsInDeck != null ? Math.min(localMaxCardsToLoad, maxCardsInDeck) : localMaxCardsToLoad;
        const [cardsInDeck, setCardsInDeck] = useState<number>(limitedMaxCardsToLoad);
        var localCardInDeck = limitedMaxCardsToLoad;
        const deckContext = useContext(DeckContext);
        if(!deckContext){
            throw new Error("DeckContext is not available");
        }
        const { deckInfo, setDeckInfo} = deckContext;


        useEffect(() => {
            console.log("cardsInDeck updated: ", cardsInDeck);
        }, [cardsInDeck]);

        //get loading area from the cardLoading Area and pass to main
        const handleCardLoadingArea = (rect: DOMRect) =>{
            // Calculate the bounding rectangle and add the current scroll position
            

            console.log("Deck Location: ", deckLocation, " deck index: ", deckIndex, " cards in deck: ", cardsInDeck, " maxCardsInDeck: ", maxCardsInDeck);
            setDeckInfo((prevPositions) => {
                const currentDeckInfo = prevPositions[deckLocation] || {};
    
                return {
                    ...prevPositions,
                    [deckLocation]: {
                        ...currentDeckInfo,
                        [deckIndex]: {
                            rect: rect,
                            currentCardsInDeck: cardsInDeck,
                            maxCardsInDeck: maxCardsInDeck,
                        },
                    },
                };
            });
            

            //onDeckPositionChange(deckLocation, deckIndex, adjustedRect as DOMRect, cardsInDeck, maxCardsInDeck);
        }

        
        useEffect(() => {
            console.log("Deck Info in decks: ", deckInfo);
        }, [deckInfo])

        return (
            <div ref={deckRef} key={deckIndex} className="deck-section">
                <h4>{deckName} {cardData[deckLocation][0].categoryType}</h4>
                <div className="cards-container">
                    <LoadingArea onDeckPositionChange={handleCardLoadingArea}/>
                    {cardData[deckLocation].slice(0, localMaxCardsToLoad).map((card) => (
                        <DraggableCard key={card.id} deckIndex = {deckIndex} card={card} deckInfos={deckInfo} onDeckCurrentNumberChange={onDeckCurrentNumberChange}/>
                    ))}
                </div>
            </div>
        )
    }
)

export default Deck;

