// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserContext from './contexts/UserContext';
import Header from './components/Header';
import ProductDisplay from './components/ProductDisplay';
import Modal from './components/Modal';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import './App.css';

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showModal, setShowModal] = useState(false);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (itemIndex !== -1) {
        // If the item already exists in the cart, update its quantity
        return prevItems.map((item, index) =>
          index === itemIndex ? { ...item, quantity: product.quantity } : item
        );
      } else {
        // If the item is not in the cart, add it with the initial quantity
        return [...prevItems, { ...product, quantity: product.quantity }];
      }
    });

    // Use the updated cartItems state to store in sessionStorage
    setCartItems((updatedCartItems) => {
      sessionStorage.setItem('cart', JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });

    setShowModal(true);
  };

  const updateCartItemQuantity = (productId, isIncrease) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: isIncrease ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const closeModal = () => setShowModal(false);

  return (
    <UserContext.Provider value={{ profile: userProfile, setProfile: setUserProfile }}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ProductDisplay addToCart={addToCart} updateCartItemQuantity={updateCartItemQuantity} />
                  {showModal && <Modal closeModal={closeModal} />}
                </>
              }
            />
            <Route path="/cart" element={<Cart cartItems={cartItems} />} />
            <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
