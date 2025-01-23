"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios'; // Import axios

interface Country {
  code: string;
  name: string;
  prefix: string;
  flag: string;
}

interface FormData {
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  password: boolean;
  phone: boolean;
  email: boolean;
}

const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    prefix: '+1',
    flag: '🇺🇸'
  },
  {
    code: 'TN',
    name: 'Tunisia',
    prefix: '+216',
    flag: '🇹🇳'
  },
  {
    code: 'FR',
    name: 'France',
    prefix: '+33',
    flag: '🇫🇷'
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    prefix: '+44',
    flag: '🇬🇧'
  },
  {
    code: 'DE',
    name: 'Germany',
    prefix: '+49',
    flag: '🇩🇪'
  }
];

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    phone: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    password: false,
    phone: false,
    email: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter(); // Initialize useRouter

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Email validation
    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: true }));
      setLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: true }));
      setLoading(false);
      return;
    }

    // Phone validation
    if (formData.phone.length < 8) {
      setErrors(prev => ({ ...prev, phone: true }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { role } = response.data.user; // Extract role from the response

        if (role === 'doctor') {
          router.push('/doctor-dashboard'); // Redirect to doctor dashboard
        } else if (role === 'secretary') {
          router.push('/secretary-dashboard'); // Redirect to secretary dashboard
        } else {
          setMessage('Unknown role. Please contact support.');
        }
      } else {
        setMessage(`Error: ${response.data.message || 'Something went wrong'}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-1/2 bg-[#0F172A] p-12">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </div>
            <span className="text-white text-xl font-semibold">MedicalOffice</span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">
              Hi there 👋
            </h1>
            <p className="text-gray-400">
              Please login.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="johndoe@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Invalid email address</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Get Started'}
            </button>

            {/* Remember me and Forgot Password */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-orange-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <span className="text-gray-300">Don't have an account? </span>
              <Link href="/register" className="text-orange-500 hover:underline">
                Sign up
              </Link>
            </div>

            {/* Display message */}
            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 relative">
        <img
          src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMl9waG90b19vZl9hX2JsYWNrX3BsdXNfc2l6ZV9mZW1hbGVfZG9jdG9yX2luX2hvc19mOGU4MTBlMi1kOWEyLTQ5OTMtOWM0Zi1kNWI2OTQ5ODVmZTNfMi5qcGc.jpg"
          alt="Medical team"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginForm;