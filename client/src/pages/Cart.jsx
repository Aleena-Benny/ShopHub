import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, cartTotal, fetchCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, fetchCart, navigate]);

  if (!user) return null;
  if (loading) return <Loader />;

  return (
    <div className="page container cart-page">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="cart-item-info">
                  <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                </div>
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                </div>
                <span className="cart-item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="btn-remove"
                  onClick={() => removeItem(item.product._id)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
