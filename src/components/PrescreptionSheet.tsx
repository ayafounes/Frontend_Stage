"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SignaturePad from 'signature_pad';

const schema = z.object({
  idPatient: z.string().uuid("Select a valid patient"),
  idConsultation: z.string().uuid("Select a valid consultation"),
  datePrescription: z.string().min(1, "Prescription date is required"),
  nameMedication: z.string().min(1, "Medication name is required"),
  typeMedication: z.string().min(1, "Medication type is required"),
  signature: z.number().min(1, "Signature is required"), // Changed to number
});

type FormData = z.infer<typeof schema>;

export default function PrescriptionSheet() {
  const [patients, setPatients] = useState<{ idPatient: string, fullName: string }[]>([]);
  const [consultations, setConsultations] = useState<{ idConsultation: string, dateConsultation: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      signature: 0,
    }
  });

  const selectedPatientId = watch("idPatient");
  const signaturePadRef = useRef<HTMLCanvasElement | null>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

  // Add signature hash conversion function
  const convertSignatureToNumber = (signatureData: string): number => {
    let hash = 0;
    for (let i = 0; i < signatureData.length; i++) {
      const char = signatureData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  };

  useEffect(() => {
    axios.get('http://localhost:4000/api/patient')
      .then(response => {
        const patientData = response.data.map((patient: { idPatient: string, firstName: string, lastName: string }) => ({
          idPatient: patient.idPatient,
          fullName: `${patient.firstName} ${patient.lastName}`,
        }));
        setPatients(patientData);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        window.alert('Failed to load patients. Check console for details');
      });
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      axios.get(`http://localhost:4000/api/consultation`)
        .then(response => {
          const consultationData = response.data.map((consultation: any) => ({
            idConsultation: consultation.idConsultation,
            dateConsultation: new Date(consultation.dateConsultation).toLocaleDateString()
          }));
          setConsultations(consultationData);
        })
        .catch(error => {
          console.error('Consultation fetch error:', {
            error: error.response?.data || error.message,
            patientId: selectedPatientId
          });
          window.alert('Failed to load consultations. Check console for details');
        });
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && signaturePadRef.current) {
      import('signature_pad').then((module) => {
        const SignaturePad = module.default;
        const pad = new SignaturePad(signaturePadRef.current!, {
          minWidth: 1,
          maxWidth: 3,
          penColor: "#000000"
        });
        pad.addEventListener('endStroke', () => {
          const signatureData = pad.toDataURL();
          const signatureHash = convertSignatureToNumber(signatureData);
          setValue("signature", signatureHash, { shouldValidate: true });
          setIsSignatureEmpty(pad.isEmpty());
        });
        setSignaturePad(pad);
      });
    }
  }, [setValue]);
  

const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSignatureEmpty) {
      setMessage('Please provide a signature');
      return;
    }
  
    setLoading(true);
    setMessage(null);
    
    try {
      const payload = {
        idPatient: data.idPatient,
        idConsultation: data.idConsultation,
        datePrescription: new Date(data.datePrescription).toISOString(),
        nameMedication: data.nameMedication,
        typeMedication: data.typeMedication,
        signature: data.signature,
      };
      console.log("Submitting payload:", payload);

      const response = await axios.post(
        'http://localhost:4000/api/prescreption', // Corrected endpoint spelling
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) { // Typically 201 for created resources
        window.alert('Prescription submitted successfully!');
        reset();
        if (signaturePad) {
          signaturePad.clear();
          setIsSignatureEmpty(true);
        }
      }
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      window.alert(`Error: ${errorDetails?.message || 'Check browser console'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
      setValue("signature", 0, { shouldValidate: true });
      setIsSignatureEmpty(true);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-gray-900">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="flex flex-col items-center">
          <div className="text-right w-full">
            <h1 className="text-2xl font-bold dark:text-gray-100">Dr. John Doe</h1>
            <p className="text-sm text-muted-foreground dark:text-gray-300">Fisioterapeuta</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">Creftto 00.00</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">(51)0000.0000</p>
            <p className="text-sm text-muted-foreground dark:text-gray-300">seu@email.aqui</p>
          </div>

          <CardTitle className="text-2xl font-bold mt-8 text-orange-600 dark:text-orange-500 text-center">
            Prescription Sheet
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Patient
                </label>
                <Select
                  onValueChange={(value) => setValue("idPatient", value)}
                  value={watch("idPatient")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.idPatient} value={patient.idPatient}>
                        {patient.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idPatient && (
                  <p className="text-red-500 text-sm mt-1">{errors.idPatient.message}</p>
                )}
              </div>

              {/* Consultation Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Consultation
                </label>
                <Select
                  onValueChange={(value) => setValue("idConsultation", value)}
                  value={watch("idConsultation")}
                  disabled={!selectedPatientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a consultation" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultations.map((consultation) => (
                      <SelectItem 
                        key={consultation.idConsultation} 
                        value={consultation.idConsultation}
                      >
                        {consultation.dateConsultation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.idConsultation && (
                  <p className="text-red-500 text-sm mt-1">{errors.idConsultation.message}</p>
                )}
              </div>
            </div>

            {/* Prescription Date */}
            <div>
              <label htmlFor="datePrescription" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Prescription Date
              </label>
              <Input
                type="date"
                id="datePrescription"
                {...register("datePrescription")} // Fixed
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 text-center dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.datePrescription && ( // Fixed
                <p className="text-red-500 text-sm mt-1">{errors.datePrescription.message}</p>
              )}
            </div>

            {/* Medication Name */}
            <div>
              <label htmlFor="nameMedication" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Medication Name
              </label>
              <Textarea
                id="nameMedication"
                {...register("nameMedication")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                rows={4}
                placeholder="Enter medication names (one per line)"
              />
              {errors.nameMedication && (
                <p className="text-red-500 text-sm mt-1">{errors.nameMedication.message}</p>
              )}
            </div>

            {/* Medication Type */}
            <div>
              <label htmlFor="typeMedication" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Medication Type
              </label>
              <Textarea
                id="typeMedication"
                {...register("typeMedication")}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                rows={4}
                placeholder="Enter medication types (one per line)"
              />
              {errors.typeMedication && (
                <p className="text-red-500 text-sm mt-1">{errors.typeMedication.message}</p>
              )}
            </div>

            {/* Signature Field */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
                Signature {isSignatureEmpty && <span className="text-red-500">*</span>}
              </label>
              <canvas
                ref={signaturePadRef}
                className={`mt-1 border-dashed border-2 rounded-md w-full h-32 dark:bg-gray-700 ${
                  isSignatureEmpty ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
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