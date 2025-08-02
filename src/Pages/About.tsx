import React from "react";
import NavBar from "../Components/NavBar";
import '../output.css';

function About(){
    return (
        <div className="min-h-screen bg-gray-100">
        <NavBar />

            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Welcome to our Card Flow Webapp
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Created by an enthusiast of psychology and coding.
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Goal is not to improve productivity but improve enjoyment of activities you are passionate about. 
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                Thanks for being here. We're just getting started — and we can't wait to grow with you.
                </p>
            </div>
        </div>
    )
}

export default About;