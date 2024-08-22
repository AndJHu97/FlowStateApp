import React, { useState, useRef, useEffect } from 'react';
import DraggableCard from "../CardComponents/DraggableCard";
import LoadingArea from "./CardLoadingArea";
import '../styles/decks.css'
interface DeckProps{
    deckType: string,
    index: number,
    cardData: { [key: string]: any[] }
    deckPositions: { [key: string]: DOMRect[] };
    onDeckPositionChange: (deckType: string, rect: DOMRect) => void;
}

const Deck: React.FC<DeckProps> = (({cardData, deckType, index, deckPositions, onDeckPositionChange}) =>
    {
        const deckRef = useRef<HTMLDivElement>(null);
        var alreadyLoaded = false;
        /*
        useEffect(() => {
            if (deckRef.current) {
                const rect = deckRef.current.getBoundingClientRect();
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
        
                onDeckPositionChange(deckType, adjustedRect as DOMRect);
            }
        }, []);
        */
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

            onDeckPositionChange(deckType, adjustedRect as DOMRect);
           
        }

        return (
            <div ref={deckRef} key={index} className="deck-section">
                <h4>{deckType} Deck</h4>
                <div className="cards-container">
                    <LoadingArea onDeckPositionChange={handleCardLoadingArea}/>
                    {cardData[deckType].map((card) => (
                        <DraggableCard key={card.id} card={card} deckPositions={deckPositions} />
                    ))}
                </div>
            </div>
        )
    }
)

export default Deck;

