import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="page container product-page">
      {message && <Message type="success" onClose={() => setMessage('')}>{message}</Message>}

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-rating-lg">★ {product.rating} ({product.numReviews} reviews)</div>
          <p className="product-description">{product.description}</p>
          <div className="product-price-lg">${product.price.toFixed(2)}</div>
          <p className="stock-info">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
