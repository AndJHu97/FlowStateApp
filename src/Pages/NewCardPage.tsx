import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NewCardPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        const newCard = {
            title, 
            description,
            note, 
            image: image ? URL.createObjectURL(image) : ''
        };

        console.log(newCard);
        try {
            window.cardData.saveCard(newCard);
            console.log('Card saved successfully!');
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const goToMainPage = () =>{
        navigate('/');
    }

    return(
        <div className="container">
             <nav>
                <Button onClick={goToMainPage}>Main Page</Button>
            </nav>

            <h2>Add New Card</h2>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formNote">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Card
                </Button>
            </Form>
        </div>
    );      
};

export default NewCardPage;
