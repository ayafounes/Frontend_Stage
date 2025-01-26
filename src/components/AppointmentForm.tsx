'use client';

import { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// Define the Zod schema for form validation
const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  description: z.string().optional(),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

export default function AppointmentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:4000/api/appointment', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage('Form submitted successfully!');
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
    <Card className="rounded-lg border-none shadow-lg mt-6 bg-gradient-to-br from-white-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative w-full max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                  Appointment Form
                </span>
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-500 rounded-full"></span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      {...register("fullName")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                </div>

                {/* Appointment Date */}
                <div className="space-y-2">
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Appointment Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="appointmentDate"
                      {...register("appointmentDate")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {errors.appointmentDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>
                    )}
                  </div>
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      id="startTime"
                      {...register("startTime")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                    )}
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      id="endTime"
                      {...register("endTime")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="space-y-2">
                  <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Appointment Type</label>
                  <div className="relative">
                    <select
                      id="appointmentType"
                      {...register("appointmentType")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="1st visit">1st Visit</option>
                      <option value="suivi">Routine Check-up</option>
                      <option value="urgence">Follow-up</option>
                      <option value="routine">Emergency</option>
                    </select>
                    {errors.appointmentType && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentType.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                  <div className="relative">
                    <textarea
                      id="description"
                      {...register("description")}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter additional details"
                      rows={4}
                    />
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
                  {loading ? 'Submitting...' : 'Submit Appointment'}
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