import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import '../Styles/View-products.css';
import { Link } from 'react-router-dom';

const ProductList = ({ setCartCount }) => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);  // Loading for fetching products
    const [error, setError] = useState(null);  // Error handling for fetching products
    const [isAddingToCart, setIsAddingToCart] = useState(false);  // Loading for add to cart operation
    const [searchTerm, setSearchTerm] = useState('');  // State for search term

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
                let data = response.data.products;
                const userdata = response.data.user;
                setUser(userdata);

                // Shuffle the products array
                data = data.sort(() => Math.random() - 0.5);

                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleWishlist = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true }).then((response) => {
            if (response.data.status) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId ? { ...product, isInWishlist: !product.isInWishlist } : product
                    )
                );
            }
        });
    };

    const addToCart = (productId) => {
        setIsAddingToCart(true);  // Set loading state to true when adding to cart
        axios.get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true })
            .then(response => {
                if (response.data.status) {
                    setCartCount(prevCount => prevCount + 1);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsAddingToCart(false);  // Reset loading state after the operation
            });
    };

    // Filter and shuffle products based on search term
    const filteredProducts = products
        .filter(product => 
            product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.Category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <section className="premium-product-section">
            <div className="container mt-3">
                {/* Search input */}
                <div className="search-bar mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search products..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                {loading ? (
                     <div className="loading-spinner">
                    
                     <div className="spinner-segment"></div>
                     <div className="spinner-segment"></div>
                     <div className="spinner-segment"></div>
                   </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                                    <div className="product-card">
                                        {user && (
                                            <div className="wishlist-btn">
                                                <button
                                                    className={`wishlist-heart ${product.isInWishlist ? 'active' : ''}`}
                                                    onClick={(event) => toggleWishlist(event, product._id)}
                                                >
                                                    <i className={`fas fa-heart ${product.isInWishlist ? 'text-danger' : 'text-muted'}`}></i>
                                                </button>
                                            </div>
                                        )}

                                        <div className="product-image-container">
                                            <img
                                                className="product-image"
                                                src={`${IMG_URL}/public/product-images/${product._id}.jpg`}
                                                alt={product.Name}
                                            />
                                            {product.Quantity < 1 ? (
                                                <div className="badge out-of-stock">Out of Stock</div>
                                            ) : product.Quantity < 5 ? (
                                                <div className="badge low-stock">Only {product.Quantity} left!</div>
                                            ) : null}
                                        </div>

                                        <div className="product-info">
                                            <span className="product-category">{product.Category}</span>
                                            <h5 className="product-title">{product.Name}</h5>
                                            <p className="product-description">{product.Description}</p>

                                            <div className="price-cart">
                                                <span className="price">₹{product.Price}</span>
                                                {product.Quantity > 0 ? (
                                                    user ? (
                                                        <button className="btn add-to-cart-btn" onClick={() => addToCart(product._id)}> 
                                                            {isAddingToCart ? (
                                                                <div className="loading-spinner">
                                                                
                                                                <div className="spinner-segment"></div>
                                                                <div className="spinner-segment"></div>
                                                                <div className="spinner-segment"></div>
                                                              </div>
                                                            ) : (
                                                                <i className="fas fa-shopping-cart"> Add to Cart</i>
                                                            )}
                                                        </button>

                                                    ) : (
                                                        <Link to={'/login'}>
                                                            <button className="btn add-to-cart-btn">
                                                                <i className="fas fa-shopping-cart"></i> Add to Cart
                                                            </button>
                                                        </Link>
                                                    )
                                                ) : (
                                                    <button className="btn out-of-stock-btn" disabled>
                                                        <i className="fas fa-times"></i> Out of Stock
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-products-message">No products found.</div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductList;