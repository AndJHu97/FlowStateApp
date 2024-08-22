// Get attributes of card moving events from mouse clicks 
import React, { useRef, useState, useEffect } from 'react';
import Card from "../CardComponents/Card";

interface DraggableCardProps {
    card: any;
    deckPositions: { [key: string]: DOMRect[] };
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, deckPositions }) => {
    const [isClicked, setIsClicked] = useState(false);
    //reference the card itself to access div or dom
    const cardRef = useRef<HTMLDivElement>(null);
    const coords = useRef<{ startX: number, startY: number }>({ startX: 0, startY: 0 });
    const [initialPosition, setInitialPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    

     // Capture the initial position of the card
     useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setInitialPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
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
        snapToDeck();
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
        if (cardRef.current) {
            const cardRect = cardRef.current.getBoundingClientRect();
            // Filter deck positions based on card type
            const filteredDeckPositions = deckPositions[card.type] || [];
            console.log("card type: " + card.type);
            let snapped = false;
            // Snap to the closest deck
            for (const deckRect of filteredDeckPositions) {
                if (isCloseToDeck(cardRect, deckRect)) {
                    cardRef.current.style.top = `${deckRect.top}px`;
                    cardRef.current.style.left = `${deckRect.left }px`;
                    console.log("deckRect new position: " + `${deckRect.top }px`);
                    console.log("New positions: " + cardRef.current.style.top);
                    snapped = true;
                    setInitialPosition({top: deckRect.top, left: deckRect.left})
                    break;
                }
            }
            if(!snapped){
                cardRef.current.style.top = `${initialPosition.top}px`;
                cardRef.current.style.left = `${initialPosition.left}px`;
                console.log("go back to original position");
            }
           
    };
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
            <Card
                title={card.title}
                image={card.image}
                description={card.description}
                note={card.note}
                type = {card.type}
            />
        </div>
    );
};

export default DraggableCard;