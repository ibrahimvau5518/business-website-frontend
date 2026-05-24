import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/apiService';

const fallbackProducts = [
  {
    _id: '64f1a23b0a1b2c3d4e5f6780',
    name: 'Heavy Duty Crane Hook 50T',
    description: 'Forged alloy steel heavy-duty crane hook with safety latch. Rated for 50 tons capacity. Perfect for industrial setups.',
    price: 450.00,
    imageUrl: 'https://i.ibb.co.com/93gVt2z6/79a5ec9c-3c05-4583-a3e8-0408e11570c5.jpg',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6781',
    name: 'Industrial PVC Tarpaulin (10x15m)',
    description: '100% waterproof, UV resistant, heavy-duty 650gsm PVC tarpaulin for outdoor equipment and severe weather.',
    price: 185.50,
    imageUrl: 'https://i.ibb.co.com/HLVhNjH2/b17da95b-fada-4aa9-8cc8-0d9e57d65261.jpg',
    category: 'Tarpaulin'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6782',
    name: 'Steel Wire Rope Sling (10m)',
    description: 'Galvanized steel wire rope sling with thimble eyes. Ideal for heavy lifting and tough rigging tasks.',
    price: 120.00,
    imageUrl: 'https://i.ibb.co.com/kghqVPsj/df473fb6-8aca-4a87-b261-5556d2bbb860.jpgx`',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6783',
    name: 'Electric Chain Hoist 5T',
    description: 'High-performance electric chain hoist with remote access. Capable of lifting up to 5 tons smoothly.',
    price: 1250.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb4hRRvGNJZfowkjdjySav6-GiPdHSlYLDIA&s',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6784',
    name: 'Heavy Duty Pulley Block',
    description: 'Snatch block pulley with swivel hook. Designed for wire rope and harsh industrial lifting conditions.',
    price: 85.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm33--dKQ_rxZ-HoN7Hcya7vNHIdvYFVE8gQ&s',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6785',
    name: 'Polyethylene Tarp (20x20m)',
    description: 'Multi-purpose poly tarp. Tear-resistant, waterproof cover for large construction sites.',
    price: 245.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW4hZ-_k4BNYuMbk96N5qc81jcHN9asWBQLw&s',
    category: 'Tarpaulin'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6786',
    name: 'Polyester Webbing Sling 3T',
    description: 'Double-ply polyester webbing sling. Lightweight, flexible, and rated for 3 tons lifting capacity.',
    price: 45.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTstdOsLDnwB2anqGifa7ipkAQWoK7nvnRN4Q&s',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6787',
    name: 'Crane Remote Control System',
    description: 'Industrial wireless radio remote control system for overhead cranes and hoists. IP65 rated.',
    price: 350.00,
    imageUrl: 'https://static-01.daraz.com.bd/p/7c8f3af5ea9b0cc3fe99d99065e33c3c.jpg',
    category: 'Electronics'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6788',
    name: 'Heavy Duty Master Link',
    description: 'Alloy steel master link for multi-leg sling assemblies. Features a high safety factor for secure lifting.',
    price: 55.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyguZp1xtuv2SiKjBVVZDQSON4QJF-5LSxTw&s',
    category: 'Crane Parts'
  },
  {
    _id: '64f1a23b0a1b2c3d4e5f6789',
    name: 'Canvas Truck Tarpaulin (15x20m)',
    description: 'Heavy duty, breathable cotton canvas tarpaulin. Ideal for long-haul trucks and sensitive cargo.',
    price: 310.00,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7JEkWojbgHA8My57Xoex2CQuQSrfKOAfREg&s',
    category: 'Tarpaulin'
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Scroll to top when loading the page
    window.scrollTo(0, 0);
    
    // Fetch products dynamically from MongoDB backend
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
    <div className="min-h-screen bg-app-bg pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-heading tracking-tight mb-4 text-center">
            All Products
          </h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            Explore our complete catalog of industrial grade crane parts and premium tarpaulins.
            
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-brand/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide z-10">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-heading mb-2 leading-tight">{product.name}</h3>
                  <p className="text-slate-500 mb-6 text-sm flex-grow line-clamp-3">{product.description}</p>
                  
                  <div className="mt-auto">
                    <div className="text-2xl font-black text-slate-800 mb-4">${product.price?.toFixed(2)}</div>
                    <button className="w-full bg-slate-900 hover:bg-brand text-white px-4 py-3 rounded-sm font-bold uppercase text-xs tracking-wider transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;