// Get attributes of card moving events from mouse clicks 
import React, { useRef, useState, useEffect } from 'react';
import Card from "../CardComponents/Card";

interface DraggableCardProps {
    card: any;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card }) => {
    const [isClicked, setIsClicked] = useState(false);
    //reference the card itself to access div or dom
    const cardRef = useRef<HTMLDivElement>(null);
    const coords = useRef<{ startX: number, startY: number }>({ startX: 0, startY: 0 });

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsClicked(true);
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            coords.current.startX = e.clientX - rect.left;
            coords.current.startY = e.clientY - rect.top;
        }
    };

    const onMouseUp = () => {
        setIsClicked(false);
    };

    const onMouseMove = (e: MouseEvent) => {
        //if card is clicked on and there's a card reference
        if (!isClicked || !cardRef.current) return;

        const nextX = e.clientX - coords.current.startX;
        const nextY = e.clientY - coords.current.startY;

        cardRef.current.style.top = `${nextY}px`;
        cardRef.current.style.left = `${nextX}px`;
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
                top: '0',
                left: '0'
            }}
        >
            <Card
                title={card.title}
                image={require(`../CardImages/${card.image}`)}
                description={card.description}
                note={card.note}
            />
        </div>
    );
};

export default DraggableCard;