import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProductContextProvider } from './context/ProductContext.jsx'
import { CartContextProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
   <AuthContextProvider>
    <ProductContextProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </ProductContextProvider>
  </AuthContextProvider>
)

