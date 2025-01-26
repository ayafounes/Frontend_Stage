"use client";
import { useState } from "react";
import axios from "axios";
import ReactFlagsSelect from "react-flags-select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlaceholderContent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    allergy: "",
    bloodType: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCountrySelect = (countryCode: string) => {
    setFormData((prevState) => ({
      ...prevState,
      country: countryCode,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:4000/api/patient", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setMessage("Form submitted successfully!");
      } else {
        setMessage(`Error: ${response.data.message || "Something went wrong"}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message || "An unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-lg border-none shadow-lg mt-6 bg-gradient-to-br from-white-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                  Patient Form
                </span>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-500 rounded-full"></span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Birth Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      required
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Marital Status */}
                <div className="space-y-2">
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marital Status
                  </label>
                  <div className="relative">
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      required
                    >
                      <option value="" disabled>
                        Select Marital Status
                      </option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Occupation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your occupation"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <div className="relative">
                    <ReactFlagsSelect
                      selected={formData.country}
                      onSelect={handleCountrySelect}
                      searchable
                      placeholder="Select your country"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-black-100"
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postal Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your postal code"
                      required
                    />
                  </div>
                </div>

                {/* Allergy */}
                <div className="space-y-2">
                  <label htmlFor="allergy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allergy
                  </label>
                  <div className="relative">
                    <textarea
                      id="allergy"
                      name="allergy"
                      value={formData.allergy}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter any allergies (e.g., peanuts, shellfish)"
                      rows={3} // Adjust the number of rows as needed
                    />
                  </div>
                </div>

                {/* Blood Type */}
                <div className="space-y-2">
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blood Type
                  </label>
                  <div className="relative">
                    <select
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      required
                    >
                      <option value="" disabled>
                        Select Blood Type
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>

              {/* Display message */}
              {message && <p className="mt-4 text-red-500">{message}</p>}
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}