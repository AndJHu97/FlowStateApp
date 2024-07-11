import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Pages/Main';
import NewCardPage from './Pages/NewCardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,  
  },
  {
    path: '/new-card',
    element: <NewCardPage />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

