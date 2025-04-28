import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//rtdatabase
import { ref as databaseRef, set, push, get,child} from 'firebase/database';
import { database, auth } from '../firebase';
import {storage} from "../firebase";
//storage
import {ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";

const NewCardPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [categoryType, setCategoryType] = useState('');
    const [rootKeys, setRootKeys] = useState<string[]>([]);
    const [cardTypes] = useState<string[]>(['Hint']);
    const [selectedCardType, setSelectedCardType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch root keys from Firebase to get the cardType for the dropdown selection
        const fetchRootKeys = async () => {
            try {
                const rootRef = databaseRef(database, '/');
                //get the database
                const snapshot = await get(rootRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    //this should be cardType, which will be in the dropdown
                    const keys = Object.keys(data);
                    setRootKeys(keys);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error('Error fetching root keys:', error);
            }
        };

        fetchRootKeys();
    }, []);
    //handle image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);
        if (e.target.files && e.target.files[0]) {
            //[0]: First file (it is not uploading many)
            setImage(e.target.files[0]);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log("test");
        var storedImageRef = null;
        var imageURL = null
        if (!image) {
            console.error('No image selected');
            return;
        }
        try{
            const user = auth.currentUser;

            if (!user){
                console.error("No user logged in.");
                return;
            }

            //access firebase
            //get to folder cardImages then make random name with v4()
            storedImageRef = storageRef(storage, `cardImages/${image.name + v4()}`);
            //upload image to the firebase storage location. Await: Wait to finish uploading or else I might get the URL of something that doesn't exist (getDownloadURL)
            await uploadBytes(storedImageRef, image).then(() =>{
                console.log("Image uploaded");
            });

            // Get download URL in firebase for the uploaded image from firebase. 
            imageURL = await getDownloadURL(storedImageRef);
            //get the new entry location for firebase in saving for this card
            const newCardRef = databaseRef(database, `users/${user.uid}/decks/${categoryType}/${selectedCardType}/${v4()}`);
            //save json card in firestore realtime database
            const newCard = {
                title,
                description,
                note,
                categoryType: categoryType,
                cardType: selectedCardType,
                image: imageURL || '' 
            };
            console.log(newCard);
            await set(newCardRef, newCard);
            } catch(error){
                console.error('Error saving card:', error);
            }
            //Delete below because will not save locally
            /*
            try {
                window.cardData.saveCard(newCard);
                console.log('Card saved successfully!');
            } catch (error) {
                console.error('Error saving card:', error);
            }
            */
    };

    const goToMainPage = () => {
        navigate('/');
    };

    return (
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
                <Form.Group controlId="formType">
                    <Form.Label>Flow Category Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={categoryType}
                        onChange={(e) => setCategoryType(e.target.value)}
                    >
                        <option value="">Select type</option>
                        {rootKeys.map((key) => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formType">
                    <Form.Label>Card Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedCardType}
                        onChange={(e) => setSelectedCardType(e.target.value)}
                    >
                        <option value="">Select type</option>
                        {cardTypes.map((cardType) => (
                            <option key={cardType} value={cardType}>{cardType}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Card
                </Button>
            </Form>
        </div>
    );
};

export default NewCardPage;
