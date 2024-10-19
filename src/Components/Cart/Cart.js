import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {BASE_URL,IMG_URL} from '../Urls/Urls';
import './Cart.css'; // Assuming you’ll add some CSS to style this component

const Cart = ({ products = [], user, setCartCount }) => {
    const [cartProducts, setCartProducts] = useState(products);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(calculateTotal(cartProducts));
    }, [cartProducts]);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const cartdata = await axios.get(`${BASE_URL}/cart`, { withCredentials: true });
                setCartProducts(cartdata.data.products);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartData();
    }, []);

    function calculateTotal(products) {
        return products.reduce(
            (sum, product) => sum + product.quantity * product.product.Price,
            35 // Assuming $35 shipping
        );
    }

    const changeQuantity = async (cartId, proId, userId, count) => {
        const currentQuantity = cartProducts.find(
            (p) => p.product._id === proId
        ).quantity;
        try {
            const response = await axios.post(`${BASE_URL}/change-productQuantity`, {
                cart: cartId,
                product: proId,
                user: userId,
                count: count,
                quantity: currentQuantity,
            }, { withCredentials: true });

            if (response.data.removeProduct) {
                alert('Product was removed from cart');
                setCartProducts(
                    cartProducts.filter((item) => item.product._id !== proId)
                );
                setCartCount(prevCount => prevCount -1);
            } else {
                setCartProducts((prevProducts) =>
                    prevProducts.map((item) =>
                        item.product._id === proId
                            ? { ...item, quantity: item.quantity + count }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="container con">
            <div id="page">
                {cartProducts && cartProducts.length > 0 ? (
                    <div className="cart-container">
                        <div className="cart-header">
                            <h3>Your Cart</h3>
                        </div>
                        <div className="cart-items">
                            {cartProducts.map((item) => (
                                <div className="cart-item" key={item.product._id}>
                                    <div className="cart-item-img">
                                        <img
                                            src={`${IMG_URL}/public/product-images/${item.product._id}.jpg`}
                                            alt={item.product.Name}
                                            className="thumb"
                                        />
                                    </div>
                                    <div className="cart-item-details">
                                        <h5>{item.product.Name}</h5>
                                        <p>${item.product.Price}</p>
                                        <div className="cart-item-quantity">
                                            <button
                                                className="btn btn-minus"
                                                onClick={() =>
                                                    changeQuantity(item._id, item.product._id, user, -1)
                                                }
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="btn btn-plus"
                                                onClick={() =>
                                                    changeQuantity(item._id, item.product._id, user, 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-total">
                                        <p>${item.product.Price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="shipping-cost">
                                <p>Shipping: $35.00</p>
                            </div>
                            <div className="total-cost">
                                <h4>Total: ${total}</h4>
                            </div>
                            <div className="checkout-btn">
                                <Link to={'/place-order'} className="btn btn-primary">Place Order</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <h5>Your cart is empty</h5>
                        <Link to={'/'} className="btn btn-primary">
                            Add products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
