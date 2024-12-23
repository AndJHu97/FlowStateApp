import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardLoadingProps {
    onDeckPositionChange: (rect: DOMRect) => void;
}


const CardLoadingArea: React.FC<CardLoadingProps> = ({ onDeckPositionChange}) => {
    const loadingAreaRef = useRef<HTMLDivElement>(null);

    //I'm in development/strict mode so it runs twice to test. Will upload 2 deckrect for array
    //pass back the loading zone for the Main page so know where to load cards
    useEffect(() =>{
        if(loadingAreaRef.current){
            // Calculate the bounding rectangle and add the current scroll position
            const rect = loadingAreaRef.current.getBoundingClientRect();
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

            onDeckPositionChange(adjustedRect as DOMRect);
        }
    }, [])

    
  return (
 
      <div className="card-container" ref = {loadingAreaRef} style={{ border: '5px solid #ccc', borderRadius: '5px', padding: '10px', display: 'inline-block' }}>
         <div className="card" style={{ width: '170px', height: '360px', border: '0px' }}>
            
         </div>
      </div>

  );
};

export default CardLoadingArea;