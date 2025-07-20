import React, {useState} from 'react';
import '../../styles/DailyCard.css'
import Card from './Card';
import CardBack from './CardBack';

interface DailyCardProps {
    card: any;
    onUnlock: (cardId: string) => void;
}

const DailyCard: React.FC<DailyCardProps> = ({card, onUnlock}) => {
    const [unlocked, setUnlocked] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);

    if(unlocked)
    {   
        if(focused){
            return(
                <div className="card-overlay">
                    <div
                        className='card-modal'
                        onClick={() => {
                            setFocused(false);
                            onUnlock(card.id);
                        }
                    }
                    >
                        <Card
                            title = {card.title}
                            image = {card.image}
                            description = {card.description}
                            note = {card.note}
                            categoryType={card.categoryType}
                            cardType={card.cardType}

                        />

                        
                    </div>
                </div>
            );
        }else{
            return null;
        }
    }else{
        return(
            
        <div
            onClick = {() => {
                setUnlocked(true)
                setFocused(true)
            }}
            style={{
                position: 'absolute',
                width: '12rem',
                height: '21rem',
                cursor: 'pointer',
                border: '2px dashed red'
            }}
        >
            <CardBack
                image = {"https://opengameart.org/sites/default/files/card%20back%20red.png"}
            />
        </div>
    );
    }
    
};

export default DailyCard;