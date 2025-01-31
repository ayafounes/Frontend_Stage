'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// Zod schema for form validation
const schema = z.object({
  idPatient: z.string().uuid("Invalid patient ID"),
  dateAppointement: z.string().min(1, "Appointment date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  typeAppointement: z.string().min(1, "Appointment type is required"),
  description: z.string().optional(), // Optional field
});

type FormData = z.infer<typeof schema>;

export default function AppointmentForm() {
  const [patients, setPatients] = useState<{ id: string, fullName: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Fetch patients on component mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/patient')
      .then(response => {
        const patientData = response.data.map((patient: { idPatient: string, firstName: string, lastName: string }) => ({
          id: patient.idPatient,
          fullName: `${patient.firstName} ${patient.lastName}`,
        }));
        setPatients(patientData);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        window.alert('Failed to load patients.');
      });
  }, []);

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);

    try {
      // Prepare payload
      const payload = {
        idPatient: data.idPatient,
        dateAppointement: new Date(data.dateAppointement).toISOString(),
        startTime: `${data.startTime}:00`,
        endTime: `${data.endTime}:00`,
        typeAppointement: data.typeAppointement,
        description: data.description || "", // Ensure description is an empty string if not provided
      };

      // Submit the form data
      const response = await axios.post('http://localhost:4000/api/appointement', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        window.alert('Appointment created successfully!');
        reset(); // Reset form fields
      } else {
        window.alert(`${response.data.message || 'Something went wrong'}`);
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      window.alert(`Error: ${error.response?.data?.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-lg border-none shadow-lg mt-6 bg-gradient-to-br from-white-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-8">
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-full max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Appointment Form</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div>
                  <label htmlFor="idPatient">Patient</label>
                  <select {...register("idPatient")} className="w-full p-3 border rounded">
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.idPatient && <p className="text-red-500">{errors.idPatient.message}</p>}
                </div>

                {/* Appointment Date */}
                <div>
                  <label htmlFor="dateAppointement">Appointment Date</label>
                  <input type="date" {...register("dateAppointement")} className="w-full p-3 border rounded" />
                  {errors.dateAppointement && <p className="text-red-500">{errors.dateAppointement.message}</p>}
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="startTime">Start Time</label>
                  <input type="time" {...register("startTime")} className="w-full p-3 border rounded" />
                  {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
                </div>

                {/* End Time */}
                <div>
                  <label htmlFor="endTime">End Time</label>
                  <input type="time" {...register("endTime")} className="w-full p-3 border rounded" />
                  {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
                </div>

                {/* Appointment Type */}
                <div>
                  <label htmlFor="typeAppointement">Appointment Type</label>
                  <select {...register("typeAppointement")} className="w-full p-3 border rounded">
                    <option value="">Select an option</option>
                    <option value="emergency">emergency</option>
                    <option value="routine">check-up</option>
                    <option value="follow-up">follow-up</option>
                    <option value="first-visit">first-visit</option>
                  </select>
                  {errors.typeAppointement && <p className="text-red-500">{errors.typeAppointement.message}</p>}
                </div>

                {/* Description (Optional) */}
                <div>
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea {...register("description")} className="w-full p-3 border rounded" rows={4} />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button type="submit" disabled={loading} className="w-full bg-orange-500 text-white p-3 rounded">
                  {loading ? 'Submitting...' : 'Submit Appointment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}