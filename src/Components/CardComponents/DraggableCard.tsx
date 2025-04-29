// Get attributes of card moving events from mouse clicks 
import React, { useRef, useState, useEffect } from 'react';
import CreatableCard from "../CardComponents/CreateableCard";

interface DeckInfo {
    [index: number]:{
        rect: DOMRect;
        maxCardsInDeck: number | null;
        currentCardsInDeck: number;
    }
}


interface DraggableCardProps {
    card: any;
    deckIndex: number;
    deckInfos: { [key: string]: DeckInfo };
    onDeckCurrentNumberChange: (deckType: string, index: number, currentCardsInDeck: number) => void;
}

//index is to check where in the 
const DraggableCard: React.FC<DraggableCardProps> = ({ card, deckIndex, deckInfos, onDeckCurrentNumberChange }) => {
    const [isClicked, setIsClicked] = useState(false);
    //reference the card itself to access div or dom
    const cardRef = useRef<HTMLDivElement>(null);
    const coords = useRef<{ startX: number, startY: number }>({ startX: 0, startY: 0 });
    const [initialPosition, setInitialPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [currentDeckIndex, setCurrentIndex] = useState(Number);
    const [isSnapped, setIsSnapped] = useState(false);
     // Capture the initial position of the card
     useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setInitialPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
        //set the index of deck to the original (don't do it again)
        setCurrentIndex(deckIndex);
    }, []);


    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsClicked(true);
        const rect = cardRef.current?.getBoundingClientRect();
        // Adjust for the current scroll position
        
        if (rect) {
            //get the difference between mouse and card
            coords.current.startX = e.clientX - rect.left;
            coords.current.startY = e.clientY - rect.top;
            console.log("coords current x: " + coords.current.startX);
        }
    };

    const onMouseUp = () => {
        console.log("Mouse up detected");
        setIsClicked(false);
        
        if (!isSnapped) {
            snapToDeck();
        }
        //reset
        setIsSnapped(false);
    };
    
    const onMouseMove = (e: MouseEvent) => {
        if (!isClicked || !cardRef.current) return;
        console.log("Mouse moving");
        
        //get the X and Y by taking mouse coordinates - difference in coordinates + scroll difference
        const nextX = e.clientX - coords.current.startX + window.scrollX;
        const nextY = e.clientY - coords.current.startY + window.scrollY;
    
        cardRef.current.style.top = `${nextY}px`;
        cardRef.current.style.left = `${nextX}px`;
    };
    

    const snapToDeck = () => {
        console.log("Card data: ", card);
        //issnapped makes it so after you snap it, it prevents it from running twice. Will reset snap = false when mouse up 
        if (isSnapped || !cardRef.current) return;
        const cardRect = cardRef.current.getBoundingClientRect();
        // Filter deck positions based on card type. i.e. act, ego, etc. Find the one based on this card that is moving
        const deckKey = card.categoryType + "/" + card.cardType;
        const sameDeckInfo = deckInfos[deckKey] || {};
        console.log("Same deck info: ", sameDeckInfo);
        //console.log("sameDeckInfo: ");
        let snapped = false;
        // Snap to the closest deck
        //iterate through the id aka location of the decks same as the cards
        //i.e. if act card, will check all act decks on the field
        for (const specificDeckIndex in sameDeckInfo) {
            if (sameDeckInfo.hasOwnProperty(specificDeckIndex)) {
                
                const deckPosition = sameDeckInfo[specificDeckIndex].rect;
                //console.log("Deck position: " + sameDeckInfo[specificDeckIndex].maxCardsInDeck);
                if (isCloseToDeck(cardRect, deckPosition) && currentDeckIndex != Number(specificDeckIndex)) {
                    //Add snap feedback from the deck to see if hit card limit
                    
                    let maxCardsInDeck = deckInfos[deckKey][specificDeckIndex].maxCardsInDeck
                    let currentCardsInDeck = deckInfos[deckKey][specificDeckIndex].currentCardsInDeck
                    console.log("number in moving deck: " + currentCardsInDeck + " number in current deck: " + deckInfos[deckKey][currentDeckIndex].currentCardsInDeck);
                    //console.log("Current key of deck: " + currentDeckIndex);
                    if (maxCardsInDeck == null) {
                        snapped = true;
                    } else {
                        if (currentCardsInDeck < maxCardsInDeck) {
                            console.log("add number");
                            currentCardsInDeck += 1;
                            deckInfos[deckKey][specificDeckIndex].currentCardsInDeck = currentCardsInDeck
                            deckInfos[deckKey][currentDeckIndex].currentCardsInDeck -= 1
                            snapped = true;
                            
                            //change the values of the deck it is moving from and the card it is moving to

                            //where it is moving from
                            onDeckCurrentNumberChange(deckKey, currentDeckIndex, deckInfos[deckKey][currentDeckIndex].currentCardsInDeck)

                            //where it is moving to
                            onDeckCurrentNumberChange(deckKey, Number(specificDeckIndex), currentCardsInDeck);

                            //change specific deck index to new one you moved to
                            setCurrentIndex(Number(specificDeckIndex));
                        } else {
                            console.log("Don't add number");
                            snapped = false;
                        }
                    }
                    //if snappable meaning there's room for another card
                    if(snapped){
                        cardRef.current.style.top = `${deckPosition.top}px`;
                        cardRef.current.style.left = `${deckPosition.left }px`;
                        setInitialPosition({top: deckPosition.top, left: deckPosition.left});
                        setIsSnapped(true);
                    }
                    
                    break;
                }
            }
        }
        if(!snapped){
            cardRef.current.style.top = `${initialPosition.top}px`;
            cardRef.current.style.left = `${initialPosition.left}px`;
            console.log("go back to original position");
        }
    };

    const isCloseToDeck = (cardRect: DOMRect, deckRect: DOMRect) => {
        const distance = 25; // Set the distance within which a card will snap to a deck
        return (
            cardRect.bottom + window.scrollY > deckRect.top - distance &&
            cardRect.top + window.scrollY < deckRect.bottom + distance &&
            cardRect.right + window.scrollX > deckRect.left - distance &&
            cardRect.left + window.scrollX < deckRect.right + distance
        );
    };

    useEffect(() => {
        if (isClicked) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isClicked]);

    return (
        <div
            ref={cardRef}
            onMouseDown={onMouseDown}
            style={{
                position: 'absolute',
                cursor: 'pointer',
            }}
        >
            <CreatableCard
                title={card.title}
                image={card.image}
                description={card.description}
                note={card.note}
                categoryType = {card.categoryType}
                cardType = {card.cardType}
                cardLocation= {card.location}
            />
        </div>
    );
};

export default DraggableCard;