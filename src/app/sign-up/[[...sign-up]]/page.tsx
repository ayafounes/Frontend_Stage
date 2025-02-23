"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMl9waG90b19vZl9hX2JsYWNrX3BsdXNfc2l6ZV9mZW1hbGVfZG9jdG9yX2luX2hvc19mOGU4MTBlMi1kOWEyLTQ5OTMtOWM0Zi1kNWI2OTQ5ODVmZTNfMi5qcGc.jpg")',
        backgroundSize: "50%", // Scale the image down so it tiles across the screen
        backgroundRepeat: "repeat", // Ensure the image is repeated/tiled
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Medical Office
          </span>
        </div>

        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome!
          </h1>
          <p className="text-gray-600">Please register.</p>
        </div>

        {/* Clerk SignUp Component with matching styling */}
        <SignUp
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              // Remove Clerk's default card so our container is used
              card: "shadow-none bg-transparent",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formFieldLabel: "block text-gray-700 mb-2",
              formFieldInput:
                "w-full bg-[#f8fafc] text-[#1e293b] pl-4 pr-4 py-2 rounded-lg border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]",
              formButtonPrimary:
                "w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200",
            },
          }}
        />
      </div>
    </div>
  );
}
