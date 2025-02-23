'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect user to the dashboard if signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard'); // Redirect if the user is signed in
    }
  }, [isSignedIn, router]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMl9waG90b19vZl9hX2JsYWNrX3BsdXNfc2l6ZV9mZW1hbGVfZG9jdG9yX2luX2hvc19mOGU4MTBlMi1kOWEyLTQ5OTMtOWM0Zi1kNWI2OTQ5ODVmZTNfMi5qcGc.jpg")',
        backgroundSize: "50%", // Scale the image down so it tiles across the screen
        backgroundRepeat: "repeat", // Ensure the image is repeated/tiled
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Office</h1>
          <p className="text-gray-600">Welcome!</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-transparent w-full',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              formFieldInput: {
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '12px 16px',
                '&:focus': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                }
              },
              formButtonPrimary: {
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                padding: '12px 16px',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: '#2563eb',
                }
              },
              footerActionText: 'text-gray-600',
              footerActionLink: 'text-orange-600 hover:text-orange-800 font-medium',
              socialButtonsBlockButton: {
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                }
              }
            },
            variables: {
              colorPrimary: '#3b82f6',
              colorText: '#1e293b',
              colorTextOnPrimaryBackground: '#fff'
            }
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up" // URL to the sign-up page
        />
      </div>
    </div>
  );
}
