import React, { useState, useEffect } from 'react';
import DraggableCard from "../CardComponents/DraggableCard";
import '../styles/decks.css'
interface DeckProps{
    deckType: string,
    index: number,
    cardData: { [key: string]: any[] }
}

const Deck: React.FC<DeckProps> = (({cardData, deckType, index}) =>
    {
        return (
            <div key={index} className="deck-section">
                <h4>{deckType} Deck</h4>
                <div className="cards-container">
                    {cardData[deckType].map((card, cardIndex) => (
                        <DraggableCard key={cardIndex} card={card}  />
                    ))}
                </div>
            </div>
        )
    }
)

export default Deck;

