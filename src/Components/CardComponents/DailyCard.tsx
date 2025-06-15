import React, {useState} from 'react';
import '../../styles/DailyCard.css'
import Card from './Card';

interface DailyCardProps {

}

const DailyCard: React.FC<DailyCardProps> = () => {
    const [unlocked, setUnlocked] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);

    if(unlocked)
    {   
        if(focused){
            return(
                <div className="card-overlay">
                    <div
                        className='card-modal'
                        onClick={() => setFocused(false)}

                    >
                        <Card
                            title = {"Test"}
                            image = {"https://opengameart.org/sites/default/files/card%20back%20red.png"}
                            description = {"test"}
                            note = {"test"}
                            categoryType={"Act"}
                            cardType={"Daily"}

                        />

                        
                    </div>
                </div>
            );
        }else{
            //Need to change this to a draggable card
            return(
                <div>
                    <Card
                            title = {"Test"}
                            image = {"https://opengameart.org/sites/default/files/card%20back%20red.png"}
                            description = {"test"}
                            note = {"test"}
                            categoryType={"Act"}
                            cardType={"Daily"}

                        />

                </div>
            )
        }
        
    }else{
        return(

        <div
            onClick = {() => {
                setUnlocked(true)
                setFocused(true)
            }}
        >
            <Card
                title = {"Test"}
                image = {"https://opengameart.org/sites/default/files/card%20back%20red.png"}
                description = {"test"}
                note = {"test"}
                categoryType={"Act"}
                cardType={"Daily"}

            />

        </div>
    );
    }
    
};

export default DailyCard;