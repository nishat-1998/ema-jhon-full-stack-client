import React,{useState} from 'react';
import { useForm } from 'react-hook-form';
import './Shipment.css';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import ProcessPayment from '../ProcessPayment/ProcessPayment';

const stripePromise = loadStripe('pk_test_51Ie12hBWfEFcwoJKPjRH7HQdwoXzf1H0txLnBUEWtII1Uup3oofpOgjUSvEq80WvU62lje3STODP1FN8XKWI4igQ00Igazvvok');


const Shipment = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [shippingData,setShippingData] =useState(null);
  const onSubmit = data => {
   setShippingData(data);
    };
    const handlePaymentSuccess=paymentId =>{
        // console.log('form submitted', data)
   const savedCart = getDatabaseCart();
   const orderDetails = {...loggedInUser,
    products:savedCart,
    Shipment:shippingData,
    paymentId,
    orderTime:new Date()}
   
   fetch('https://mighty-journey-45487.herokuapp.com/addOrder',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(orderDetails)
   })
   .then(res => res.json())
   .then(data =>{
     if(data){
       processOrder();
       alert('Your Order Placed Successfully')
     }
   })

    }

  console.log(watch("example")); // watch input value by passing the name of it

  return (
   <div className="row">
     <div style={{display:shippingData ? 'none': 'block'}} className="col-md-6">
     <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
      <input name="name" defaultValue={loggedInUser.name} ref={register({ required: true })} placeholder="Your Name" />
      {errors.name && <span className="error">Name is required</span>}
     
      <input name="email" defaultValue={loggedInUser.email} ref={register({ required: true })}  placeholder="Your Email"/>
      {errors.email && <span className="error">Email is required</span>}
     
      <input name="address" ref={register({ required: true })}  placeholder="Your Address" />
      {errors.address && <span className="error">Address is required</span>}
     
      <input name="phone" ref={register({ required: true })}  placeholder="Your Phone Number"/>
      {errors.phone && <span className="error">Phone Number is required</span>}
      
      <input type="submit" />
    </form>
     </div>
     <div style={{display:shippingData ? 'block': 'none'}}  className="col-md-6">
       <h2>Please Pay</h2>
       <Elements stripe={stripePromise}>
      <ProcessPayment handlePayment={handlePaymentSuccess}></ProcessPayment>
    </Elements>
      
     </div>
   </div>
  );
};

export default Shipment;