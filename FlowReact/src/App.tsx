import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from './Pages/Main';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,  
  }
]);


const App: React.FC = () => {
  return (
    <RouterProvider router = {router} />
  );
};

export default App;
