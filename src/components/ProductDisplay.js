// ProductDisplay.js
import React, { useState } from 'react';
import './ProductDisplay.css';

const ProductDisplay = ({ addToCart, updateCartItemQuantity }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Hoodie', price: 10, imageUrl: 'hoodie.png', quantity: 0 },
    { id: 2, name: 'T-Shirt', price: 15, imageUrl: 'tee.png', quantity: 0 },
  ]);

  const increaseQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
      )
    );

    // Update the cart item quantity in the parent component
    updateCartItemQuantity(productId, true);
  };

  const decreaseQuantity = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );

    // Update the cart item quantity in the parent component
    updateCartItemQuantity(productId, false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };
// add select button
  return (
    <div className="ProductDisplay">
      {products.map((product) => (
        <div key={product.id} className="ProductItem">
          <img src={product.imageUrl} alt={product.name} />
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          <div className="QuantityControl">
            <button onClick={() => decreaseQuantity(product.id)}>-</button>
            <span>{product.quantity}</span>
            <button onClick={() => increaseQuantity(product.id)}>+</button>
          </div>
          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductDisplay;
