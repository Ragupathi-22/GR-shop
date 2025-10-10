// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";

// const CheckoutPage = () => {
//   const { cart, cartTotal } = useCart();
//   const {user, isAuthenticated } = useAuth();
//   const [checkoutLoading, setCheckoutLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   useEffect(() => {
//   if (user?.email) {
//     setFormData(prev => ({ ...prev, email: user.email }));
//   }
// }, [user]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (cart.length === 0) {
//       alert("Cart is empty.");
//       return;
//     }

//     // Prepare address object matching WooCommerce expected format
//     const address = {
//       billing: {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         address_1: formData.address,
//         city: formData.city,
//         state: formData.state,
//         postcode: formData.zipCode,
//         email: formData.email,
//         phone: formData.phone,
//       },
//       shipping: {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         address_1: formData.address,
//         city: formData.city,
//         state: formData.state,
//         postcode: formData.zipCode
//       },
//     };

//     try {
//       setCheckoutLoading(true);
//       const response = await fetch('/api/checkout/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // send cookies (token)
//         body: JSON.stringify({ address , paymentMethod: "cod", }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         // Redirect user to checkoutUrl (autologin + pay page)
//         window.location.href = result.checkoutUrl;
//       } else {
//         alert("Failed to place order: " + (result.message || 'Unknown error'));
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         alert("Error placing order: " + error.message);
//       } else {
//         alert("Error placing order: " + String(error));
//       }
//     }
//     finally {
//       setCheckoutLoading(false);
//     }
//   };


//   if (cart.length === 0) {
//     return (
//       <div className="bg-gray-50 min-h-screen py-12">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
//           <p className="text-gray-600 mb-6">
//             You need to add items to your cart before checking out.
//           </p>
//           <Link
//             href="/products"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
//           >
//             Browse Products
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-lg font-medium text-gray-800">Shipping Information</h2>
//               </div>
//               <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                 {!isAuthenticated && (
//                   <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
//                     <p className="text-blue-800 text-sm">
//                       Already have an account?{" "}
//                       <Link href="/login" className="font-medium underline">
//                         Log in
//                       </Link>{" "}
//                       for a faster checkout experience.
//                     </p>
//                   </div>
//                 )}

//                 {/* Personal Information */}
//                 <div className="space-y-4">
//                   <h3 className="text-gray-700 font-medium">Personal Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="firstName"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         id="lastName"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         readOnly
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone Number *
//                       </label>
//                       <input
//                         type="tel"
//                         id="phone"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="space-y-4 border-t border-gray-200 pt-6">
//                   <h3 className="text-gray-700 font-medium">Shipping Address</h3>
//                   <div>
//                     <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                       Street Address *
//                     </label>
//                     <input
//                       type="text"
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                         City *
//                       </label>
//                       <input
//                         type="text"
//                         id="city"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                         State/Province *
//                       </label>
//                       <input
//                         type="text"
//                         id="state"
//                         name="state"
//                         value={formData.state}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                         ZIP/Postal Code *
//                       </label>
//                       <input
//                         type="text"
//                         id="zipCode"
//                         name="zipCode"
//                         value={formData.zipCode}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 {/* <div className="space-y-4 border-t border-gray-200 pt-6">
//                   <h3 className="text-gray-700 font-medium">Payment Method</h3>
//                   <div className="space-y-2">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="credit_card"
//                         checked={formData.paymentMethod === "credit_card"}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-gray-700">Credit Card</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="paypal"
//                         checked={formData.paymentMethod === "paypal"}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-gray-700">PayPal</span>
//                     </label>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     You'll be redirected to our secure payment gateway after placing your order.
//                   </p>
//                 </div> */}

//                 <div className="border-t border-gray-200 pt-6 flex justify-between">
//                   <Link href="/cart" className="text-blue-600 hover:text-blue-800 font-medium">
//                     Return to Cart
//                   </Link>
//                   <button
//                     type="submit"
//                     disabled={checkoutLoading}
//                     className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors ${checkoutLoading ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                   >
//                     {checkoutLoading ? "Placing Order..." : "Place Order"}
//                   </button>

//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-4 mb-6">
//                   {cart.map((item) => (
//                     <div key={item.id} className="flex items-start">
//                       <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
//                         <img
//                           src={item.image || "https://via.placeholder.com/100"}
//                           alt={item.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="ml-4 flex-grow">
//                         <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
//                         <div className="flex justify-between mt-1">
//                           <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
//                           <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="border-t border-gray-200 pt-4 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">${cartTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Shipping</span>
//                     <span>Calculated at next step</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Tax</span>
//                     <span>Calculated at next step</span>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>${cartTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import AddressForm, { AddressFormData } from "@/components/addressForm/AddressForm";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Address option toggle: saved or custom
  const [useSavedAddress, setUseSavedAddress] = useState<boolean>(true);

  // Saved address from user context
  const savedAddress: AddressFormData = {
    firstName: user?.address?.firstName || "",
    lastName: user?.address?.lastName || "",
    address1: user?.address?.address1 || "",
    address2: user?.address?.address2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    phone: user?.address?.phone || "",
  };

  // Form data state
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: savedAddress.phone,
    address: savedAddress.address1,
    city: savedAddress.city,
    state: savedAddress.state,
    zipCode: savedAddress.postalCode,
    paymentMethod: "cod",
  });

  const [addressFormData, setAddressFormData] = useState<AddressFormData>(
    useSavedAddress ? savedAddress : {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
    }
  );

  const [orderSuccess, setOrderSuccess] = useState<{ orderId: number; total: string } | null>(null);

  // Update formData when user or useSavedAddress changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: savedAddress.phone,
      address: savedAddress.address1,
      city: savedAddress.city,
      state: savedAddress.state,
      zipCode: savedAddress.postalCode,
    }));
    setAddressFormData(useSavedAddress ? savedAddress : {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
    });
  }, [user, useSavedAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({
      ...prev, [name]: value,
    }));
  };

  const handleCheckoutCOD = async (address: any) => {
    try {
      setCheckoutLoading(true);
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address, paymentMethod: "cod" }),
      });
      const result = await response.json();
      if (result.success) {
        setOrderSuccess({ orderId: result.orderId, total: result.total });
        // clearCart();
      } else {
        alert("Failed to place order: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error placing order: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckoutRazorpay = async (address: any) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      alert("Razorpay SDK not loaded yet. Please wait a moment.");
      return;
    }
    try {
      setCheckoutLoading(true);
      const orderRes = await fetch("/api/payment/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal, currency: "INR" }),
      });
      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error("Failed to create Razorpay order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GR Shop",
        order_id: orderData.id,
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#2563eb" },
        handler: async function (response: any) {
          const createOrderRes = await fetch("/api/checkout/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              address,
              paymentMethod: "razorpay",
              paymentDetails: response,
            }),
          });
          const createOrderData = await createOrderRes.json();
          if (createOrderData.success) {
            setOrderSuccess({ orderId: createOrderData.orderId, total: createOrderData.total });
            // clearCart();
          } else {
            alert("Failed to place order: " + (createOrderData.message || "Unknown error"));
          }
          setCheckoutLoading(false);
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Error during payment: " + (error instanceof Error ? error.message : String(error)));
      setCheckoutLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty.");

    // Use saved or custom address depending on toggle
    const addressToUse = useSavedAddress ? savedAddress : addressFormData;

    // Compose address object in WooCommerce format
    const address = {
      billing: {
        first_name: addressToUse.firstName,
        last_name: addressToUse.lastName,
        address_1: addressToUse.address1,
        address_2: addressToUse.address2,
        city: addressToUse.city,
        state: addressToUse.state,
        postcode: addressToUse.postalCode,
        email: formData.email,
        phone: addressToUse.phone,
      },
      shipping: {
        first_name: addressToUse.firstName,
        last_name: addressToUse.lastName,
        address_1: addressToUse.address1,
        address_2: addressToUse.address2,
        city: addressToUse.city,
        state: addressToUse.state,
        postcode: addressToUse.postalCode,
      },
    };

    if (formData.paymentMethod === "cod") {
      await handleCheckoutCOD(address);
    } else if (formData.paymentMethod === "razorpay") {
      await handleCheckoutRazorpay(address);
    }
  };

  if (cart.length === 0)
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );

  return (
    <>
      {checkoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
            <p className="text-gray-800 text-center text-lg font-semibold">
              {formData.paymentMethod === "razorpay"
                ? "Processing your online payment..."
                : "Placing your order..."}
            </p>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Please do not refresh or leave the page.
            </p>
          </div>
        </div>
      )}

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Razorpay script loaded")}
        onError={() => alert("❌ Failed to load Razorpay SDK")}
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Shipping Information</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {!isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                      <p className="text-blue-800 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium underline">
                          Log in
                        </Link>{" "}
                        for a faster checkout experience.
                      </p>
                    </div>
                  )}

                  {/* Personal Information */}
                  {/* <div className="space-y-4">
                    <h3 className="text-gray-700 font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Address selector */}
                  <div className="mt-6 mb-4">
                    {user?.address ? (
                      <>
                        <label className="mr-6 inline-flex items-center">
                          <input
                            type="radio"
                            name="addressOption"
                            value="saved"
                            checked={useSavedAddress}
                            onChange={() => {
                              setUseSavedAddress(true);
                              setAddressFormData(savedAddress);
                            }}
                            className="mr-2"
                          />
                          Use saved address
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="addressOption"
                            value="custom"
                            checked={!useSavedAddress}
                            onChange={() => {
                              setUseSavedAddress(false);
                              setAddressFormData({
                                firstName: '',
                                lastName: '',
                                address1: '',
                                address2: '',
                                city: '',
                                state: '',
                                postalCode: '',
                                phone: '',
                              });
                            }}
                            className="mr-2"
                          />
                          Enter new address
                        </label>
                      </>
                    ) : (
                      <p className="text-gray-700 mb-4">Please enter your shipping address below.</p>
                    )}
                  </div>

                  {/* Address Form */}
                  {!user?.address || !useSavedAddress ? (                    
                      <AddressForm
                        addressData={addressFormData}
                        onChange={handleAddressChange}
                        showButtons={false}
                        isEditing={true}
                      />
                  ) : (
                    // Show saved address read-only if useSavedAddress is true
                    <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-md">
                      <p>
                        {savedAddress.firstName} {savedAddress.lastName}
                      </p>
                      <p>{savedAddress.address1}</p>
                      {savedAddress.address2 && <p>{savedAddress.address2}</p>}
                      <p>
                        {savedAddress.city}, {savedAddress.state} {savedAddress.postalCode}
                      </p>
                      <p>{savedAddress.phone}</p>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h3 className="text-gray-700 font-medium">Payment Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Cash on Delivery</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === "razorpay"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Card, UPI</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 flex justify-between">
                    <Link href="/cart" className="text-blue-600 hover:text-blue-800 font-medium">
                      Return to Cart
                    </Link>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors ${checkoutLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      {checkoutLoading ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "https://via.placeholder.com/100"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>Calculated at next step</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span>Calculated at next step</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={() => {
            setOrderSuccess(null);
            clearCart();
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-1">
              Order ID: <span className="font-medium">{orderSuccess.orderId}</span>
            </p>
            <p className="text-gray-600 mb-6">
              Total: <span className="font-medium">${orderSuccess.total}</span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  clearCart();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  clearCart();
                  window.location.href = "/products";
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
