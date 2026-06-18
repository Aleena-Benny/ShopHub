import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="badge badge-sold">Sold Out</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-rating">★ {product.rating}</span>
        </div>
      </div>
    </Link>
  );
}
