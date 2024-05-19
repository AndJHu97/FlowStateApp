import React, { useEffect, useRef, useState } from 'react'; 
import Card from "../CardComponents/Card";
import 'bootstrap/dist/css/bootstrap.min.css';
//import CardInfo from "../CardData/Test.json";
import fs from 'fs';
import path from 'path';

function Main(){
    // Import the image file
    //const myImage = require(`../CardImages/${CardInfo.image}`);
    //State variable. Keep track if it is clicked or not
    //useState sets initial isClicked value to false. Change value with setIsClicked. Will update page after doing so 
    const [isClicked, setIsClicked] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null); // Ref for the Card component
    const coords = useRef<{
        startX: number,
        startY: number,
        lastX: number,
        lastY: number
    }>({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    });

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsClicked(true);
        const rect = cardRef.current?.getBoundingClientRect(); // Get position of card
        if (rect) {
            coords.current.startX = e.clientX - rect.left;
            coords.current.startY = e.clientY - rect.top;
        }
    }

    const onMouseUp = () => {
        setIsClicked(false);
    }

    const onMouseMove = (e: MouseEvent) => {
        //if not clicked on and there's no card being clicked, then ignore
        if (!isClicked || !cardRef.current) return;

        const nextX = e.clientX - coords.current.startX;
        const nextY = e.clientY - coords.current.startY;

        cardRef.current.style.top = `${nextY}px`;
        cardRef.current.style.left = `${nextX}px`;
    }

    const [cardData, setCardData] = useState<any[]>([]);
    
    useEffect(() => {
        const cardDataPath = path.join(__dirname, 'CardData');

        fs.readdir(cardDataPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            const jsonDataFiles = files.filter(file => file.endsWith('.json'));

            const cardDataPromises = jsonDataFiles.map(file => {
                return new Promise<any>((resolve, reject) => {
                    fs.readFile(path.join(cardDataPath, file), 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(JSON.parse(data));
                    });
                });
            });

            Promise.all(cardDataPromises)
                .then(allCardData => {
                    setCardData(allCardData);
                })
                .catch(err => {
                    console.error('Error reading JSON files:', err);
                });
        });
    }, []);



    //whenever isClicked value changes, it runs it
    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        //clean up. When isClicked is false
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        //dependency array. Whenever value changes, triggers this
    }, [isClicked]);


    return (
        <div>
        {cardData.map((card,index) => (
            <div
            key = {index}
            ref={cardRef}
            onMouseDown={onMouseDown}
            style={{
                position: 'absolute',
                cursor: 'pointer'
            }}
        >
            <Card
                title={card.title}
                image={require(`../CardImages/${card.image}`)}
                description={card.description}
                note={card.note}
            />
            </div>

        ))}
           
        </div>
    );
}

export default Main;
