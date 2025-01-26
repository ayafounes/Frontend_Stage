"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SignaturePad from 'signature_pad';

// Define the Zod schema for form validation
const schema = z.object({
  datePrescreption: z.string().min(1, "Prescription date is required"),
  nameMedication: z.string().min(1, "Medication name is required"),
  typeMedication: z.string().min(1, "Medication type is required"),
  signature: z.string().min(1, "Signature is required"),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

export default function PrescreptionSheet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const signaturePadRef = useRef(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== 'undefined') {
      import('signature_pad').then((module) => {
        const SignaturePad = module.default;
        if (signaturePadRef.current) {
          const pad = new SignaturePad(signaturePadRef.current);
          setSignaturePad(pad);
        }
      });
    }
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setMessage('');

    // Save the signature as a data URL
    if (signaturePad && !signaturePad.isEmpty()) {
      const signatureData = signaturePad.toDataURL();
      setValue("signature", signatureData);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/prescription', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage('Prescription submitted successfully!');
      } else {
        setMessage(`Error: ${response.data.message || 'Something went wrong'}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
      setValue("signature", ""); // Clear the signature value in the form
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-gray-900" style={{ backgroundImage: "url('/path/to/your/image.png')" }}>
      {/* Overlay Form */}
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="flex flex-col items-center">
          {/* Doctor's Information in Top-Right Corner */}
          <div className="text-right w-full">
            <h1 className="text-2xl font-bold dark:text-gray-100">Dr. John Doe</h1>
            <p className="text-sm text-muted-foreground dark:text-gray-300">Fisioterapeuta</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">Creftto 00.00</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">(51)0000.0000</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">seu@email.aqui</p>
          </div>

          {/* Prescription Sheet Title Centered */}
          <CardTitle className="text-2xl font-bold mt-8 text-orange-600 dark:text-orange-500 text-center">
            Prescription Sheet
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Date Field */}
            <div>
              <label htmlFor="datePrescreption" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Prescription Date
              </label>
              <Input
                type="date"
                id="datePrescreption"
                {...register("datePrescreption")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 text-center dark:bg-gray-700 dark:text-gray-100"
                style={{ textAlign: 'center' }} // Center the date text inside the input
              />
              {errors.datePrescreption && (
                <p className="text-red-500 text-sm mt-1">{errors.datePrescreption.message}</p>
              )}
            </div>

            {/* Medication Name Field (Large Text Box) */}
            <div>
              <label htmlFor="nameMedication" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Medication Name
              </label>
              <Textarea
                id="nameMedication"
                {...register("nameMedication")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                rows={4} // Adjust the number of rows as needed
                placeholder="Enter medication names (one per line)"
              />
              {errors.nameMedication && (
                <p className="text-red-500 text-sm mt-1">{errors.nameMedication.message}</p>
              )}
            </div>

            {/* Medication Type Field (Large Text Box) */}
            <div>
              <label htmlFor="typeMedication" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Medication Type
              </label>
              <Textarea
                id="typeMedication"
                {...register("typeMedication")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                rows={4} // Adjust the number of rows as needed
                placeholder="Enter medication types (one per line)"
              />
              {errors.typeMedication && (
                <p className="text-red-500 text-sm mt-1">{errors.typeMedication.message}</p>
              )}
            </div>

            {/* Electronic Signature Field */}
            <div>
              <label htmlFor="signature" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Signature
              </label>
              <canvas
                ref={signaturePadRef}
                className="mt-1 border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-md w-full h-32 dark:bg-gray-700"
              />
              <Button
                type="button"
                onClick={clearSignature}
                className="mt-2 bg-orange-500 hover:bg-orange-400 text-white dark:bg-orange-600 dark:hover:bg-orange-500"
              >
                Clear Signature
              </Button>
              {errors.signature && (
                <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Prescription'}
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