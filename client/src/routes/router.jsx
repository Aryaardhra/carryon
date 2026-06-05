import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Collection from "../pages/Collection";
import Blog from "../pages/Blog";
import Login from "../pages/Login";
import Contact from "../pages/Contact";
import ProductDetails from "../pages/ProductDetails";
import AdminLayout from "../admin/pages/AdminLayout";
import AddProduct from "../admin/pages/AddProduct";
import ProductList from "../admin/pages/ProductList";
import Orders from "../admin/pages/Orders";
import AdminRoute from "./AdminRoute";
import { AuthContextProvider } from "../context/AuthContext";
import { ProductContextProvider } from "../context/ProductContext";
import { CartContextProvider } from "../context/CartContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: < App/>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/collection", element: <Collection /> },
      { path: "/products/:productId", element: <ProductDetails /> },
      { path: "/blog", element: <Blog /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: "NotFound" },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "admin",
    element: <AdminRoute />,
    children: [
      { index: true, element: <AddProduct /> },
      { path: "product-list", element: <ProductList /> },
      { path: "orders", element: <Orders /> },
    ],
  },
  { path: "*", element: "NotFound" },
]);

export default router;
