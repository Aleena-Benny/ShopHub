import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  image: '',
  stock: '',
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = () => {
    api.getProducts({ limit: 100 })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editing) {
        await api.updateProduct(editing, payload);
        setMessage('Product updated');
      } else {
        await api.createProduct(payload);
        setMessage('Product created');
      }
      setForm(emptyProduct);
      setEditing(null);
      loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setMessage('Product deleted');
      loadProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user?.isAdmin) return null;
  if (loading) return <Loader />;

  return (
    <div className="page container admin-page">
      <h1>Admin — Manage Products</h1>
      {message && <Message type="success">{message}</Message>}
      {error && <Message type="error">{error}</Message>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Home</option>
              <option>Sports</option>
              <option>Books</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
          {editing && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(emptyProduct); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="admin-product-cell">
                    <img src={p.image} alt={p.name} />
                    {p.name}
                  </div>
                </td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
