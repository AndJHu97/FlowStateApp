import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DraggableCard from "../CardComponents/DraggableCard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

function Main() {
    const [cardData, setCardData] = useState<any[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await window.cardData.fetchCards();
                if (data !== undefined) {
                    setCardData(data);
                } else {
                    console.log("Fetched card data incorrect");
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchData();
    }, []);

    const goToNewCardPage = () =>{
        navigate('/new-card');
    }
    return (
        <div>

            <nav>
                <Button onClick={goToNewCardPage}>Add New Card</Button>
            </nav>


            {cardData.map((card, index) => (
                <DraggableCard key={index} card={card} />
            ))}
            
        </div>
    );
}

export default Main;
