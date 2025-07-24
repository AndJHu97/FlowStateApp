import React from 'react';
import '../output.css';

const NavBar = () => {
  return (
    <nav className="w-full bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">Flow State</h1>
        <div className="flex space-x-12 p-2">
          <a href="/" className="mr-12 text-white hover:text-blue-200 transition-colors">Home</a>
          <a href="/about" className="mr-12 text-white hover:text-blue-200 transition-colors">About</a>
          <a href="/contact" className="mr-12 text-white hover:text-blue-200 transition-colors">Contact</a>
          <a href="/new-card" className="mr-12 text-white hover:text-blue-200 transition-colors">New Card</a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
