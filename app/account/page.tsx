"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import AddressForm, { AddressFormData } from "@/components/addressForm/AddressForm";
import { useGlobalLoading } from "@/context/GlobalLoadingContext";
import OrdersList from "@/components/orderList/orderList";

const AccountPage = () => {
  const { user, updateUserProfile, updateUserAddress } = useAuth();
  const { setGlobalLoading: setGlobalLoading } = useGlobalLoading();
  const [viewOrders, setViewOrders] = useState(false);


  const [profileFormData, setProfileFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    firstName: user?.address?.firstName || "",
    lastName: user?.address?.lastName || "",
    address1: user?.address?.address1 || "",
    address2: user?.address?.address2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    phone: user?.address?.phone || "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    setProfileFormData({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
    });
    setAddressFormData({
      firstName: user?.address?.firstName || "",
      lastName: user?.address?.lastName || "",
      address1: user?.address?.address1 || "",
      address2: user?.address?.address2 || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      phone: user?.address?.phone || "",
    });
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFormData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!profileFormData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!profileFormData.email.trim() || !/\S+@\S+\.\S+/.test(profileFormData.email)) {
      toast.error("Valid email is required");
      return;
    }
    try {
      setGlobalLoading(true);
      await updateUserProfile({
        first_name: profileFormData.firstName,
        last_name: profileFormData.lastName,
        email: profileFormData.email,
      });
    }
    catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      return;
    } finally {
      // any cleanup if needed
      setGlobalLoading(false);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressFormData.firstName.trim() || !addressFormData.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    if (!addressFormData.address1.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!addressFormData.city.trim() || !addressFormData.state.trim() || !addressFormData.postalCode.trim()) {
      toast.error("City, state, and postal code are required");
      return;
    }
    try {
      setGlobalLoading(true);
      await updateUserAddress(addressFormData);
    }
    catch (error: any) {
      toast.error(error.message || "Failed to update address");
      return;
    } finally {
      setGlobalLoading(false);
      setIsEditingAddress(false);
      toast.success("Address updated successfully");
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your account</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          {/* <nav className="bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
            <ul className="space-y-4 text-gray-700 font-semibold">
              <li>
                <a
                  href="#profile"
                  className="block px-4 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  My Account
                </a>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="block px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </nav> */}

          <nav className="bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
            <ul className="space-y-4 text-gray-700 font-semibold">
              <li>
                <button
                  onClick={() => setViewOrders(false)}
                  className={`block px-4 py-2 rounded-md font-medium ${!viewOrders ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Profile Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => setViewOrders(true)}
                  className={`block px-4 py-2 rounded-md font-medium ${viewOrders ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  My Orders
                </button>
              </li>
            </ul>
          </nav>


          {/* Main Content */}
          <main className="md:col-span-3 bg-white rounded-lg shadow-md p-6 overflow-hidden">
            {viewOrders ? (
              <OrdersList />
            ) : (
              <>
                {/* Profile Info */}
                <section id="profile" className="mb-12">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={profileFormData.firstName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={profileFormData.lastName}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={profileFormData.email}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileFormData({
                              firstName: user.first_name || "",
                              lastName: user.last_name || "",
                              email: user.email || "",
                            });
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                        <p className="mt-1 text-gray-900">{user.first_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                        <p className="mt-1 text-gray-900">{user.last_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Address Section */}
                <section id="address">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Address</h2>
                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {user.address?.address1 ? "Edit Address" : "Add Address"}
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleAddressSubmit}>
                    <AddressForm
                      addressData={addressFormData}
                      onChange={handleAddressChange}
                      showButtons={false}  // hide buttons inside AddressForm
                      isEditing={isEditingAddress}
                    />

                    {isEditingAddress && (
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingAddress(false);
                            setAddressFormData({
                              firstName: user.address?.firstName || "",
                              lastName: user.address?.lastName || "",
                              address1: user.address?.address1 || "",
                              address2: user.address?.address2 || "",
                              city: user.address?.city || "",
                              state: user.address?.state || "",
                              postalCode: user.address?.postalCode || "",
                              phone: user.address?.phone || "",
                            });
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Save Address
                        </button>
                      </div>
                    )}
                  </form>

                  {!isEditingAddress && (
                    <>
                      {user.address ? (
                        <div className="space-y-2">
                          <p className="text-gray-900">
                            {user.address.firstName} {user.address.lastName}
                          </p>
                          <p className="text-gray-700">{user.address.address1}</p>
                          {user.address.address2 && (
                            <p className="text-gray-700">{user.address.address2}</p>
                          )}
                          <p className="text-gray-700">
                            {user.address.city}, {user.address.state} {user.address.postalCode}
                          </p>
                          <p className="text-gray-700">{user.address.phone}</p>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">You haven't added an address yet.</p>
                        </div>
                      )}
                    </>
                  )}
                </section>
              </>)}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
