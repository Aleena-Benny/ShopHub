import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;
  if (loading) return <Loader />;

  return (
    <div className="page container orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`order-status ${order.isPaid ? 'paid' : ''}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: <strong>${order.totalPrice.toFixed(2)}</strong></span>
                <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
