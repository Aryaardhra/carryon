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
//import Orders from "../admin/pages/Orders";
import AdminRoute from "./AdminRoute";
import { AuthContextProvider } from "../context/AuthContext";
import { ProductContextProvider } from "../context/ProductContext";
import { CartContextProvider } from "../context/CartContext";
import ProductCategory from "../pages/ProductCategory";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "../components/admin/AdminLogin";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import AddCategory from "../admin/pages/AddCategory";
import CategoryList from "../admin/pages/CategoryList";
import EditProduct from "../admin/pages/EditProduct";
import CheckOut from "../pages/CheckOut";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancelled from "../pages/PaymentCancelled";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import AdminOrders from "../admin/pages/AdminOrders";
import AdminOrderDetails from "../admin/pages/AdminOrderDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "collection", element: <Collection /> },
      { path: "category/:id", element: <ProductCategory /> },
      { path: "product/pid/:productId", element: <ProductDetails /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      
      {
        element: <ProtectedRoute />,
        children: [
          
          { path: "cart", element: "Cart" },
          { path: "checkout", element: <CheckOut /> },
          { path: "payment-success", element: <PaymentSuccess /> },
          { path: "payment-cancelled", element: <PaymentCancelled /> },
          { path: "orders", element: <MyOrders /> },
          { path: "orders/:orderId", element: <OrderDetails /> },
          { path: "my-profile", element: <Profile /> },
          { path: "wishlist", element: "wishlist" },
        ],
      },
    ],
  },

  { path: "/verify-email/:token", element: <VerifyEmail /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          /*{ index: true, element: <AddCategory /> },*/
          { index: true, path: "category-list", element: <CategoryList /> },
          { path: "add-product", element: <AddProduct /> },
          { path: "edit/:id", element: <EditProduct />},
          { path: "product-list", element: <ProductList /> },
          { path: "/admin/orders", element: <AdminOrders /> },
          { path: "/admin/orders/:orderId", element: <AdminOrderDetails /> },
        ],
      },
    ],
  },

  { path: "*", element: <>404 Not Found</> },
]);

export default router;
