import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import '../../styles/CardForm.css';

// Firebase imports
import { ref as databaseRef, set, push, get, child } from 'firebase/database';
import { database } from '../../firebase';
import { storage } from "../../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

interface CardFormProps {
    onClose: () => void;
    parentCardLocation: string;
    cardType: string;
    categoryType: string;
}

const CardForm: React.FC<CardFormProps> = ({ onClose, parentCardLocation, cardType, categoryType }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [image, setImage] = useState<File | null>(null);
    console.log("Card location: ", parentCardLocation);
    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!image) {
            console.error('No image selected');
            return;
        }

        try {
            // Upload image to Firebase storage
            const storedImageRef = storageRef(storage, `cardImages/${image.name + v4()}`);
            await uploadBytes(storedImageRef, image);

            const imageURL = await getDownloadURL(storedImageRef);

            const newCardRef = databaseRef(database, `${parentCardLocation}/${cardType}/${v4()}`);
            const newCard = {
                title,
                description,
                note,
                categoryType,
                cardType,
                image: imageURL || ''
            };
            onClose(); // Close the form after submitting
            await set(newCardRef, newCard);
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    return (
        <div >
            <button onClick={onClose} className="close-btn">&times;</button>
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
                <Form.Group controlId="formType">
                    <Form.Label>Card Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={cardType}
                        disabled={true}
                    >
                        <option value="">
                            {"Only one type available"}
                        </option>
                        <option value={cardType}>{cardType}</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Card
                </Button>
            </Form>
        </div>
    );
};

export default CardForm;
