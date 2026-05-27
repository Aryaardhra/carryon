import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import Blog from "../pages/Blog";
import Login from "../pages/Login";
import Contact from "../pages/Contact";
import ProductDetails from "../pages/ProductDetails";


const router = createBrowserRouter([

    
    {
        path : "/",
        element: (
              <App />
             ),
        children : [
            {path : "/", element : <Home /> },
            {path : "/collection", element : <Collection /> },
            {path :"/products/:productId", element : <ProductDetails /> },
            {path : "/blog", element : <Blog /> },
            {path : "/contact", element : <Contact /> },
            {path: "*", element: "NotFound"},
        ],
    },    
     {
    path:"/login", element: <Login />
  },  
])
 

export default router;