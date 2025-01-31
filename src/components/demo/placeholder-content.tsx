"use client";
import { useState } from "react";
import axios from "axios";
import ReactFlagsSelect from "react-flags-select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // For React Hook Form integration
import { useForm, SubmitHandler } from "react-hook-form"; // For form handling

// Define the Zod schema for form validation
const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.enum(["M", "F", "O"]),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  adress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional(),
  allergy: z.string().optional(),
  bloodType: z.string().optional(),
});

// Infer the type from the Zod schema
type PatientFormData = z.infer<typeof patientSchema>;

export default function PlaceholderContent() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema), // Integrate Zod with React Hook Form
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCountrySelect = (countryCode: string) => {
    setValue("country", countryCode); // Set the country value using React Hook Form's setValue
  };

  const onSubmit: SubmitHandler<PatientFormData> = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/patient", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        window.alert("Patient added successfully!");
        // Reset the form
        Object.keys(data).forEach((key) => setValue(key as keyof PatientFormData, ""));
      }
    } catch (error: any) {
      window.alert(`Error: ${error.response?.data?.message || error.message || "An unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-lg border-none shadow-lg mt-6 bg-gradient-to-br from-white-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative w-full max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      {...register("firstName")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
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
                      {...register("lastName")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
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
                      {...register("birthDate")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                    )}
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
                      {...register("gender")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                {/* Marital Status (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marital Status
                  </label>
                  <div className="relative">
                    <select
                      id="maritalStatus"
                      {...register("maritalStatus")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Select Marital Status (Optional)</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Occupation (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Occupation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="occupation"
                      {...register("occupation")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your occupation (Optional)"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your email (Optional)"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
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
                      {...register("phone")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label htmlFor="adress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="adress"
                      {...register("adress")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your address"
                    />
                    {errors.adress && (
                      <p className="text-red-500 text-sm mt-1">{errors.adress.message}</p>
                    )}
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
                      {...register("city")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <div className="relative">
                    <ReactFlagsSelect
                      selected={watch("country")}
                      onSelect={handleCountrySelect}
                      searchable
                      placeholder="Select your country"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-black-100"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Postal Code (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Postal Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="postalCode"
                      {...register("postalCode")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your postal code (Optional)"
                    />
                  </div>
                </div>

                {/* Allergy (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="allergy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allergy
                  </label>
                  <div className="relative">
                    <textarea
                      id="allergy"
                      {...register("allergy")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter any allergies (Optional)"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Blood Type (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Blood Type
                  </label>
                  <div className="relative">
                    <select
                      id="bloodType"
                      {...register("bloodType")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Select Blood Type (Optional)</option>
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