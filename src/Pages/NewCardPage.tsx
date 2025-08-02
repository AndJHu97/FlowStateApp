import React, { useState, useEffect } from 'react';
import { Button, Form, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//rtdatabase
import { ref as databaseRef, set, push, get,child} from 'firebase/database';
import { database, auth } from '../firebase';
import {storage} from "../firebase";
//storage
import {ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from "uuid";
import NavBar from '../Components/NavBar';
import '../output.css';

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
        <div>
            <NavBar />

            <div className="container mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
                <h2 className="text-2xl font-bold mb-4">Add New Card</h2>

                <Form onSubmit={onSubmit} className="space-y-4">
                <Form.Group controlId="formTitle">
                    <Form.Label className="font-semibold">Title</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 ml-2"
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label className="font-semibold">Description</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 ml-2"
                    />
                </Form.Group>

                <Form.Group controlId="formNote">
                    <Form.Label className="font-semibold">Note</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 ml-2"
                    />
                </Form.Group>

                <Form.Group controlId="formImage" className="mb-4">
                    <div className="flex items-center gap-4 mb-2">
                    <Form.Label className="font-semibold">Image</Form.Label>

                        <div className="relative inline-block">
                            <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-black font-small py-1.5 px-2 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                            >
                            Upload Image
                            </label>

                            <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        </div>

                </Form.Group>

                <Form.Group controlId="formType">
                    <Form.Label className="font-semibold">Flow Category Type</Form.Label>
                    <Form.Control
                    as="select"
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    className="mt-1 ml-2"
                    >
                    <option value="">Select type</option>
                    {rootKeys.map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formCardType">
                    <Form.Label className="font-semibold">Card Type</Form.Label>
                    <Form.Control
                    as="select"
                    value={selectedCardType}
                    onChange={(e) => setSelectedCardType(e.target.value)}
                    className="mt-1 ml-2"
                    >
                    <option value="">Select type</option>
                    {cardTypes.map((cardType) => (
                        <option key={cardType} value={cardType}>{cardType}</option>
                    ))}
                    </Form.Control>
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                    py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                    >
                Save Card
                </Button>
                </Form>
            </div>
        </div>
    );
};

export default NewCardPage;
