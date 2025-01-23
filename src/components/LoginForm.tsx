"use client";

import React, { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface FormData {
  fullName: string;
  password: string; // Changed from email to password
  phone: string;
}

interface FormErrors {
  password: boolean; // Changed from email to password
  phone: boolean;
}

interface Country {
  id: number;
  name: string;
}

const countries: Country[] = [
  { id: 1, name: 'Tunisia' },
  { id: 2, name: 'USA' },
  { id: 3, name: 'Canada' }
];

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    password: '', // Changed from email to password
    phone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    password: false, // Changed from email to password
    phone: false
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);

  const router = useRouter(); // Using useRouter for navigation

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryListOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Example validation (password and phone)
    if (formData.password.length < 6) { // Changed validation for password
      setErrors(prev => ({ ...prev, password: true }));
      return;
    }
    if (formData.phone.length < 8) {
      setErrors(prev => ({ ...prev, phone: true }));
      return;
    }

    console.log('Form submitted:', formData);
    router.push('/dashboard'); // Navigate to another page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <div className="mb-4">
          <label htmlFor="fullName" className="block font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            type="password" // Changed to password type
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block font-medium mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.phone ? 'border-red-500' : ''
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              Phone number must be at least 8 digits.
            </p>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block font-medium mb-2">Country</label>
          <button
            type="button"
            onClick={() => setIsCountryListOpen(!isCountryListOpen)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-left"
          >
            {selectedCountry.name}
          </button>
          {isCountryListOpen && (
            <ul className="absolute z-10 bg-white border rounded w-full mt-2">
              {countries.map(country => (
                <li
                  key={country.id}
                  onClick={() => handleCountrySelect(country)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {country.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          Login
        </button>

        <p className="text-blue-400 text-center mt-4">
          Not registered yet?{' '}
          <Link href="/register">
            <a className="text-orange-500 cursor-pointer hover:underline">Register now</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;