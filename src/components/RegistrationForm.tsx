"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import ReactFlagsSelect from "react-flags-select"; // Import ReactFlagsSelect

// Define the validation schema using Zod
const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  birthDate: z.string().min(1, "Birth Date is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"), // Country is required
  postalCode: z.string().min(1, "Postal Code is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  hireDate: z.string().optional(), // Optional field
  employmentStatus: z.string().optional(), // Optional field
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleCountrySelect = (countryCode: string) => {
    setValue("country", countryCode); // Update the form state with the selected country code
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
    // Handle form submission (e.g., send data to an API)
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
            <h1 className="text-white text-4xl font-bold mb-2">Hi there 👋</h1>
            <p className="text-gray-400">Please register.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-gray-300 mb-2">First Name</label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-gray-300 mb-2">Last Name</label>
                <input
                  {...register("lastName")}
                  id="lastName"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-gray-300 mb-2">Birth Date</label>
                <input
                  type="date"
                  {...register("birthDate")}
                  id="birthDate"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                )}
              </div>

              {/* Gender Selection */}
              <div>
                <label htmlFor="gender" className="block text-gray-300 mb-2">Gender</label>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      {...field}
                      id="gender"
                      className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  {...register("phone")}
                  id="phone"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Phone"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-gray-300 mb-2">Address</label>
                <input
                  {...register("address")}
                  id="address"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-gray-300 mb-2">City</label>
                <input
                  {...register("city")}
                  id="city"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-gray-300 mb-2">Country</label>
                <Controller
                  name="country"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ReactFlagsSelect
                      selected={field.value}
                      onSelect={(countryCode) => {
                        field.onChange(countryCode); // Update the form state
                        handleCountrySelect(countryCode); // Handle the country selection
                      }}
                      searchable
                      placeholder="Select your country"
                      className="w-full bg-[#1E293B] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="postalCode" className="block text-gray-300 mb-2">Postal Code</label>
                <input
                  {...register("postalCode")}
                  id="postalCode"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Postal Code"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                <input
                  {...register("username")}
                  id="username"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  id="password"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-gray-300 mb-2">Role</label>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <select
                      {...field}
                      id="role"
                      className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="doctor">Doctor</option>
                      <option value="secretary">Secretary</option>
                    </select>
                  )}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Hire Date (Optional) */}
              <div>
                <label htmlFor="hireDate" className="block text-gray-300 mb-2">Hire Date <span className="text-gray-500">(Optional)</span></label>
                <input
                  type="date"
                  {...register("hireDate")}
                  id="hireDate"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Employment Status (Optional) */}
              <div>
                <label htmlFor="employmentStatus" className="block text-gray-300 mb-2">Employment Status <span className="text-gray-500">(Optional)</span></label>
                <input
                  {...register("employmentStatus")}
                  id="employmentStatus"
                  className="w-full bg-[#1E293B] text-white pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Employment Status"
                />
              </div>
            </div>

            {/* Register Button */}
            <div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Register
              </Button>
            </div>
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
}