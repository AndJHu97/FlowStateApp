import React, { useState, useRef, useEffect } from 'react';
import DraggableCard from "../CardComponents/DraggableCard";
import LoadingArea from "./CardLoadingArea";
import '../styles/decks.css'

interface DeckInfo {
    rect: DOMRect[];
    maxCardsInDeck: number | null;
    currentCardsInDeck: number;
}


interface DeckProps{
    deckType: string,
    index: number,
    cardData: { [key: string]: any[]}
    deckInfos: { [key: string]: DeckInfo }; // Use the DeckInfo interface here
    maxCardsInDeck?: number | null;
    maxCardsToLoad?: number | null;
    onDeckPositionChange: (deckType: string, rect: DOMRect, currentCardsInDeck: number, maxCardsInDeck: number | null) => void;
}

const Deck: React.FC<DeckProps> = (({cardData, deckType, index, deckInfos: deckInfos, maxCardsInDeck = null, maxCardsToLoad = null, onDeckPositionChange}) =>
    {
        const deckRef = useRef<HTMLDivElement>(null);
        

        const localMaxCardsToLoad = maxCardsToLoad === null ? cardData[deckType].length : maxCardsToLoad;
        const limitedMaxCardsToLoad = maxCardsInDeck != null ? Math.min(localMaxCardsToLoad, maxCardsInDeck) : localMaxCardsToLoad;
        const [cardsInDeck, setCardsInDeck] = useState<number>(limitedMaxCardsToLoad);
        var localCardInDeck = limitedMaxCardsToLoad;
        useEffect(() => {
            console.log("cardsInDeck updated: ", cardsInDeck);
        }, [cardsInDeck]);

        //get loading area from the cardLoading Area and pass to main
        const handleCardLoadingArea = (rect: DOMRect) =>{
            // Calculate the bounding rectangle and add the current scroll position
            const adjustedRect = {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                bottom: rect.bottom + window.scrollY,
                right: rect.right + window.scrollX,
                width: rect.width,
                height: rect.height,
                x: rect.x + window.scrollX,
                y: rect.y + window.scrollY
            };

            onDeckPositionChange(deckType, adjustedRect as DOMRect, cardsInDeck, maxCardsInDeck);
        }
        

        return (
            <div ref={deckRef} key={index} className="deck-section">
                <h4>{deckType} Deck</h4>
                <div className="cards-container">
                    <LoadingArea onDeckPositionChange={handleCardLoadingArea}/>
                    {cardData[deckType].slice(0, localMaxCardsToLoad).map((card) => (
                        <DraggableCard key={card.id} card={card} deckInfos={deckInfos} />
                    ))}
                </div>
            </div>
        )
    }
)

export default Deck;

