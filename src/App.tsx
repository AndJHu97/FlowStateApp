import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Pages/Main';
import NewCardPage from './Pages/NewCardPage';
import Test from './Pages/Test';
import SignIn from './Components/auth/SignIn'
import SignUp from './Components/auth/SignUp'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,  
  },
  {
    path: '/new-card',
    element: <NewCardPage />
  },
  {
    path: '/sign-in',
    element:<SignIn />,
  },
  {
    path: '/sign-up',
    element:<SignUp />,
  },
  {
    path: '/test',
    element: <Test />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

