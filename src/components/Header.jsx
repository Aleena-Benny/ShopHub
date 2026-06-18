import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Shop<span>Hub</span>
        </Link>

        <nav className="nav">
          <Link to="/">Shop</Link>
          {user && <Link to="/orders">Orders</Link>}
          {user?.isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
