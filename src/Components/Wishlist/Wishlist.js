import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BASE_URL,IMG_URL} from '../Urls/Urls';


const Wishlist = ({ setCartCount }) => {
   
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishData = await axios.get(`${BASE_URL}/wishlist`, { withCredentials: true });
                console.log('wish ', wishData.data.wishlistItems);
                setWishlistItems(wishData.data.wishlistItems);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();
        axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true }).then((response) => {
            console.log('Removed from wishlist:', response);
    
            if (response.data.status) {
                // Update local wishlist items state in real-time
                setWishlistItems((prevItems) =>
                    prevItems.filter((item) => item.product._id !== productId)
                );
            }
        }).catch((error) => {
            console.error('Error removing from wishlist:', error);
        });
    };
    

    return (
        <section>
            <div className="con">
                <div className="container">
                    <div className="row">
                        <h5>Wishlist</h5>
                        {wishlistItems.length > 0 ? wishlistItems.map((item) => (
                            <div className="col-md-3 p-3" key={item.product._id}>
                                <div className="card" style={{ width: '15rem', height: '26rem' }}>
                                <button
                               style={{
                                width: '35px',
                                height: '35px',
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: 0.9,
                                zIndex: '999',
                                transition: 'background-color 0.3s ease',
                            }}
                                            className="btn btn-danger"
                                            onClick={(event) => toggleWishlist(event, item.product._id)}
                                        >
                                           X
                                        </button>
                                    <img
                                        className="card-img-top"
                                        src={`${IMG_URL}/public/product-images/${item.product._id}.jpg`}
                                        alt="Product" 
                                        style={{ height: '11rem' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.product.Name}</h5>
                                        <p className="card-text">Rs: {item.product.Price}</p>
                                        <p className="card-text">{item.product.Category}</p>
                                        <p className="card-text">{item.product.Description}</p>

                                        {item.product.Quantity < 1 ? (
                                            <p className="card-text">Stock out</p>
                                        ) : item.product.Quantity < 5 ? (
                                            <p className="card-text">Only {item.product.Quantity} left!</p>
                                        ) : null}

                                        {/* Button to remove item from wishlist */}
                                        
                                    </div>
                                </div>
                            </div>
                        )) : <p>Your wishlist is empty!</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Wishlist;
