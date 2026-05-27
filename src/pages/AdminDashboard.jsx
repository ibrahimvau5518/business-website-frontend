import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/apiService';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Crane Parts'
    // imageUrl will be handled separately during upload
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Security Check (Frontend simulation - backend will also block unauthorized calls)
  // Assuming 'admin@gmail.com' is the admin email. Switch this to your email!
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com';
  
  const isAdmin = user && user.email === ADMIN_EMAIL;

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Create an account on api.imgbb.com to get your API key
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY; 
    
    if(!apiKey || apiKey === 'your_imgbb_api_key_here') {
       throw new Error('Please add your ImgBB API Key to the .env file');
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.url; // The direct image link
    } else {
      throw new Error('Image upload failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image first.');
      return;
    }

    setUploadingImage(true);
    try {
      // 1. Upload to ImgBB and get the URL
      const imageUrl = await uploadToImgBB(imageFile);

      // 2. API call to your backend with the new image URL
      const res = await api.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        imageUrl: imageUrl
      });
      
      toast.success('Product added successfully!');
      setProducts([res.data, ...products]); // Update list locally
      setNewProduct({ name: '', description: '', price: '', category: 'Crane Parts' }); // Reset form
      setImageFile(null); // Reset image
      
      // Reset the file input field visually
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

      setActiveTab('products');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to add product (Check backend/API keys)');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return (
    <div className="min-h-screen pt-32 flex justify-center items-start bg-app-bg text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-heading uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage your website content here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4 h-fit">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('products')} 
                className={`w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm ${activeTab === 'products' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Products ({products.length})
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('add')} 
                className={`w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm ${activeTab === 'add' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Add New Product
              </button>
            </li>
            <li className="pt-4 mt-4 border-t border-slate-100">
              <button className="w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm text-slate-400 cursor-not-allowed">
                Total Users (Coming Soon)
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {activeTab === 'products' && (
            <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold uppercase tracking-wide">Manage Products</h2>
              </div>
              
              {loading ? (
                <div className="p-10 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand mx-auto"></div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Image</th>
                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Name</th>
                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Price</th>
                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Category</th>
                        <th className="p-4 font-bold text-xs uppercase text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id || p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-4">
                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded bg-white border border-slate-200" />
                          </td>
                          <td className="p-4 font-medium text-slate-800">{p.name}</td>
                          <td className="p-4 text-brand font-bold">${p.price}</td>
                          <td className="p-4 text-sm text-slate-500">{p.category}</td>
                          <td className="p-4 text-right space-x-2">
                            <button className="text-slate-400 hover:text-brand text-sm font-medium">Edit</button>
                            <button className="text-slate-400 hover:text-red-500 text-sm font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <p className="p-8 text-center text-slate-500">No products found.</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-white rounded-md shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold uppercase tracking-wide">Add New Product</h2>
              </div>
              
              <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Product Name</label>
                    <input type="text" name="name" required value={newProduct.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Price ($)</label>
                    <input type="number" name="price" required value={newProduct.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Category</label>
                    <select name="category" value={newProduct.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand">
                      <option value="Crane Parts">Crane Parts</option>
                      <option value="Tarpaulin">Tarpaulin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Upload Image</label>
                    <input type="file" id="image-upload" accept="image/*" required onChange={handleImageChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-[#2b9690]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Description</label>
                  <textarea name="description" required value={newProduct.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={uploadingImage} className={`px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md ${uploadingImage ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand hover:bg-[#2b9690] text-white'}`}>
                    {uploadingImage ? 'Uploading Image & Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;