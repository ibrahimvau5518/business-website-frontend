import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/apiService';

const fallbackProducts = [
  {
    _id: '64f1a23b0a1b2c3d4e5f6789',
    name: 'Heavy Duty Crane Hook 50T',
    description: 'Forged alloy steel heavy-duty crane hook with safety latch. Rated for 50 tons capacity.',
    price: 450.00,
    imageUrl: 'https://i.ibb.co.com/93gVt2z6/79a5ec9c-3c05-4583-a3e8-0408e11570c5.jpg',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6790',
    name: 'Industrial PVC Tarpaulin (10x15m)',
    description: '100% waterproof, UV resistant, heavy-duty 650gsm PVC tarpaulin for outdoor equipment.',
    price: 185.50,
    imageUrl: 'https://i.ibb.co.com/HLVhNjH2/b17da95b-fada-4aa9-8cc8-0d9e57d65261.jpg',
    category: 'Tarpaulin'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6791',
    name: 'Steel Wire Rope Sling (10m)',
    description: 'Galvanized steel wire rope sling with thimble eyes. Ideal for heavy lifting and rigging.',
    price: 120.00,
    imageUrl: 'https://i.ibb.co.com/kghqVPsj/df473fb6-8aca-4a87-b261-5556d2bbb860.jpg',
    category: 'Crane Parts'
  }
];

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts); // For visual testing if DB is empty
        }
      } catch (err) {
        console.error('Error fetching products from MongoDB:', err);
        setError(true);
        // Fallback to real-looking data if backend is offline
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black uppercase text-heading tracking-tight mb-4">Our Featured Products</h2>
        <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Browse our top-quality selection of crane parts and tarpaulin products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-heading mb-2">{product.name}</h3>
                <p className="text-slate-600 mb-4 h-16 overflow-hidden text-sm leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                  <span className="text-2xl font-black text-heading">${product.price?.toFixed(2)}</span>
                  <button className="bg-heading hover:bg-brand text-white px-5 py-2 rounded font-bold uppercase text-sm transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/products" className="bg-brand hover:bg-[#2b9690] text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;