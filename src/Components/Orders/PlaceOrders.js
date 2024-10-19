import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {BASE_URL} from "../Urls/Urls";

const PlaceOrderForm = ({ user, success }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    Name: "",
    Mobile: "",
    Address: "",
    Pincode: "",
    userId: user._id,
  });
  const [formErrors, setFormErrors] = useState({
    Name: "",
    Mobile: "",
    Address: "",
    Pincode: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false); // Track if the order is completed
  const navigate = useNavigate(); // useNavigate for redirection

  useEffect(() => {
    axios.get(`${BASE_URL}/place-order`, { withCredentials: true }).then((response) => {
      console.log(response.data);
      setTotal(response.data.total);
    });
  }, []);

  useEffect(() => {
    if (paymentMethod === "ONLINE") {
      setAvailabilityMessage("Not available online payment at this time");
    } else {
      setAvailabilityMessage("");
    }
  }, [paymentMethod]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to validate form fields
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.Name.trim()) {
      errors.Name = "Name is required";
      isValid = false;
    }
    if (!formData.Mobile.trim()) {
      errors.Mobile = "Mobile is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.Mobile)) {
      errors.Mobile = "Mobile number must be 10 digits";
      isValid = false;
    }
    if (!formData.Address.trim()) {
      errors.Address = "Address is required";
      isValid = false;
    }
    if (!formData.Pincode.trim()) {
      errors.Pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.Pincode)) {
      errors.Pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOrderCompleted) return; // Prevent submitting if the order is already completed

    // Validate form data before proceeding
    if (!validateForm()) return;

    // Trigger animation before submitting the order
    success(true);
    handleAnimation();

    try {
      const response = await axios.post(`${BASE_URL}/place-order`, formData, { withCredentials: true });
      if (response.data.status) {
        // After submitting, run the animation and redirect after a delay
        setTimeout(() => {
          alert("Ordered successfully");
          navigate("/order-success"); // Redirect to success page
        }, 6000); // Adjust time to match animation duration
      } else {
        alert("Failed to place order"); // Alert if the order failed
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order, please try again."); // Show alert on error
    }
  };

  const handleAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOrderCompleted(true); // Mark order as completed
      setTimeout(() => {
        setIsAnimating(false); // Reset animation after completion
      }, 10000); // 10 seconds to match the animation duration
    }
  };

  return (
    <section>
      <div className="container con">
        <form id="checkform" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <h4 className="text-center">Enter delivery address</h4>
            <div>
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="Name"
                placeholder="Enter Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
              {formErrors.Name && <span style={{color:'red'}} className="error">{formErrors.Name}</span>}
              <label>Mobile</label>
              <input
                type="number"
                className="form-control"
                name="Mobile"
                placeholder="Enter Mobile"
                value={formData.Mobile}
                onChange={handleInputChange}
              />
              {formErrors.Mobile && <span style={{color:'red'}} className="error">{formErrors.Mobile}</span>}
              <label>Address</label>
              <input
                className="form-control"
                type="text"
                name="Address"
                placeholder="Address"
                value={formData.Address}
                onChange={handleInputChange}
              />
              {formErrors.Address && <span style={{color:'red'}} className="error">{formErrors.Address}</span>}
              <label>Pincode</label>
              <input
                className="form-control"
                type="number"
                name="Pincode"
                placeholder="Pincode"
                value={formData.Pincode}
                onChange={handleInputChange}
              />
              {formErrors.Pincode && <span style={{color:'red'}} className="error">{formErrors.Pincode}</span>}
            </div>
          </div>

          <div className="col-md-4">
            <div className="container mt-5 mr-3 checkout">
              <h5>Total amount {total}</h5>
              <div className="payment">
                <p>Payment method</p>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="payment-method"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={handlePaymentChange}
                  />
                  COD
                </label>
                <br />
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="payment-method"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={handlePaymentChange}
                  />
                  Online payment
                  <p id="availability-message" className="message">
                    {availabilityMessage}
                  </p>
                </label>
                <br />
                <button
                  className={`order mt-1 ${isAnimating ? "animate" : ""}`}
                  type="submit"
                  disabled={isOrderCompleted || paymentMethod === "ONLINE"}
                >
                  <span className="default">Complete Order</span>
                  <span className="success">
                    Order Placed
                    <svg viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                  </span>
                  <div className="box"></div>
                  <div className="truck">
                    <div className="back"></div>
                    <div className="front">
                      <div className="window"></div>
                    </div>
                    <div className="light top"></div>
                    <div className="light bottom"></div>
                  </div>
                  <div className="lines"></div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlaceOrderForm;
