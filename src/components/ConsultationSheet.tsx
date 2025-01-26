"use client";
import { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Define the Zod schema for form validation
const schema = z.object({
  dateConsultation: z.string().min(1, "Consultation date is required"),
  diagnostic: z.string().min(1, "Diagnostic is required"),
  treatment: z.string().min(1, "Treatment is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  cost: z.string().min(1, "Cost is required").regex(/^\d+(\.\d{1,2})?$/, "Cost must be a valid number"),
  statusPaiement: z.string().min(1, "Payment status is required"),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

export default function ConsultationSheet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:4000/api/consultation', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage('Consultation submitted successfully!');
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
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-gray-900" style={{ backgroundImage: "url('/path/to/your/image.png')" }}>
      {/* Overlay Form */}
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="flex flex-col items-center">
          {/* Consultation Sheet Title Centered */}
          <CardTitle className="text-2xl font-bold mt-8 text-orange-600 dark:text-orange-500 text-center">
            Consultation Sheet
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Consultation Details Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateConsultation" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Consultation Date</label>
                <Input
                  type="date"
                  id="dateConsultation"
                  {...register("dateConsultation")}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
                {errors.dateConsultation && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateConsultation.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Cost</label>
                <Input
                  type="number"
                  id="cost"
                  {...register("cost")}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                />
                {errors.cost && (
                  <p className="text-red-500 text-sm mt-1">{errors.cost.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="diagnostic" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Diagnostic</label>
              <Textarea
                id="diagnostic"
                {...register("diagnostic")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.diagnostic && (
                <p className="text-red-500 text-sm mt-1">{errors.diagnostic.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Treatment</label>
              <Textarea
                id="treatment"
                {...register("treatment")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.treatment && (
                <p className="text-red-500 text-sm mt-1">{errors.treatment.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Symptoms</label>
              <Textarea
                id="symptoms"
                {...register("symptoms")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.symptoms && (
                <p className="text-red-500 text-sm mt-1">{errors.symptoms.message}</p>
              )}
            </div>

            

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Consultation'}
              </Button>
            </div>

            {/* Display message */}
            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}