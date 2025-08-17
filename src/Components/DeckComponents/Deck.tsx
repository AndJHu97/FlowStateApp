import React, { useState, useRef, useEffect, useContext } from 'react';
import LoadingArea from "./CardLoadingArea";
import '../../styles/Main.css'
import DraggableCard from '../CardComponents/DraggableCard';
import { DeckContext } from '../../Contexts/DeckContext';
import DailyCard from '../CardComponents/DailyCard';



interface DeckProps{
    deckID: string,
    deckIndex: number,
    deckName: string,
    cardData: { [key: string]: any[]}
    isHoldingDailyCard: boolean,
    maxCardsInDeck?: number | null;
    maxCardsToLoad?: number | null;
}

const Deck: React.FC<DeckProps> = (({cardData, deckID: deckLocation, deckIndex, deckName, isHoldingDailyCard = false, maxCardsInDeck = null, maxCardsToLoad = null}) =>
    {
        const deckRef = useRef<HTMLDivElement>(null);
        const localMaxCardsToLoad = maxCardsToLoad === null ? cardData[deckLocation].length : maxCardsToLoad;
        const numOfCardsLoaded = cardData[deckLocation].length;
        const [numOfCardsInDeck] = useState<number>(numOfCardsLoaded);
        const [unlockedCardIds, setUnlockedCardIds] = useState<Set<string>>(new Set());

        console.log("Deck location: " + deckLocation + " cards in deck " + numOfCardsLoaded);
        const deckContext = useContext(DeckContext);
        if(!deckContext){
            throw new Error("DeckContext is not available");
        }
        const { deckInfo, setDeckInfo} = deckContext;

        //get loading area from the cardLoading Area and pass to main
        const handleCardLoadingArea = (rect: DOMRect) =>{
            // Calculate the bounding rectangle and add the current scroll position
            console.log("Deck Location: ", deckLocation, " deck index: ", deckIndex, " cards in deck: ", numOfCardsInDeck, " maxCardsInDeck: ", maxCardsInDeck);
            setDeckInfo((prevDeckInfos) => {
                //note deck location is the location saved in the firebase, not the physical location on page
                const currentDeckInfoInType = prevDeckInfos[deckLocation] || {};
    
                return {
                    ...prevDeckInfos,
                    [deckLocation]: {
                        ...currentDeckInfoInType,
                        [deckIndex]: {
                            rect: rect,
                            currentNumOfCardsInDeck: numOfCardsInDeck,
                            maxCardsInDeck: maxCardsInDeck,
                            //Get the already set selected card id
                            cardIDsOrderInDeck: currentDeckInfoInType[deckIndex]?.cardIDsOrderInDeck
                        },
                    },
                };
            });
            

            //onDeckPositionChange(deckLocation, deckIndex, adjustedRect as DOMRect, cardsInDeck, maxCardsInDeck);
        }


        const handleUnlock = (cardId: string) => {
            setUnlockedCardIds(prev => new Set(prev).add(cardId))
        }
        
        useEffect(() => {
            console.log("Deck Info in decks: ", deckInfo);
        }, [deckInfo])

        //set the initial cards in deck in order
        //top card is 0 index
        useEffect(() => {
            setDeckInfo((prevDeckInfos) => {
                const currentDeckInfoInType = prevDeckInfos[deckLocation] || {};
                const cardIDsOrderInDeck = cardData[deckLocation].slice(0, localMaxCardsToLoad).map((card) => (
                    card.id
                )).reverse()
                return{
                    ...prevDeckInfos,
                    [deckLocation]: {
                        ...currentDeckInfoInType,
                        [deckIndex]: {
                            rect: currentDeckInfoInType[deckIndex].rect,
                            currentNumOfCardsInDeck: numOfCardsInDeck,
                            maxCardsInDeck: maxCardsInDeck,
                            cardIDsOrderInDeck: cardIDsOrderInDeck,
                        },
                    },
                };
            })
        }, [])

        //Can change from daily card to draggable cards
        return (
            <div ref={deckRef} key={deckIndex} className="deck-section">
                <h4>{deckName} {cardData[deckLocation][0].categoryType}</h4>
                <div className="deck-cards-container">
                    <LoadingArea onDeckPositionChange={handleCardLoadingArea}/>
                    {cardData[deckLocation].slice(0, localMaxCardsToLoad).map((card) => (
                        unlockedCardIds.has(card.id) || !isHoldingDailyCard ? (
                            <DraggableCard key={card.id} deckIndex = {deckIndex} card={card}/>
                        ) : (
                            <DailyCard key={card.id} card={card} onUnlock={handleUnlock}/>
                        )
                    ))}
                </div>
            </div>
        )
    }
)

export default Deck;

