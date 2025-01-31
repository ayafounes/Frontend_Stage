"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const schema = z.object({
  idPatient: z.string().uuid("Select a valid patient"),
  idAppointement: z.string().uuid("Select a valid appointment"),
  dateConsultation: z.coerce.date({  // Use coerce.date instead of string
    required_error: "Consultation date is required",
    invalid_type_error: "Invalid date format",
  }),
  diagnostic: z.string().min(1, "Diagnostic is required"),
  treatment: z.string().min(1, "Treatment is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  cost: z.string()
    .min(1, "Cost is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid cost format (e.g. 100.00)")
});
type FormData = z.infer<typeof schema>;

export default function ConsultationSheet() {
  const [patients, setPatients] = useState<{ idPatient: string, fullName: string }[]>([]);
  const [appointments, setAppointments] = useState<{ idAppointement: string, dateAppointement: string }[]>([]);
  const [loading, setLoading] = useState(false);
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
  });

  const selectedPatientId = watch("idPatient");

  useEffect(() => {
    axios.get('http://localhost:4000/api/patient')
      .then(response => {
        const patientData = response.data.map((patient: { idPatient: string, firstName: string, lastName: string }) => ({
          idPatient: patient.idPatient,
          fullName: `${patient.firstName} ${patient.lastName}`,
        }));

        // Sort patients alphabetically by fullName
        patientData.sort((a: { fullName: string }, b: { fullName: string }) => a.fullName.localeCompare(b.fullName));

        setPatients(patientData);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        window.alert('Failed to load patients.');
      });
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      axios.get('http://localhost:4000/api/appointement')
        .then(response => {
          // Log the response to check the structure of the data
          console.log("Appointments Data:", response.data);
          
          const filteredAppointments = response.data
            .filter((appointment: any) => appointment.idPatient === selectedPatientId)
            .map((appointment: any) => ({
              idAppointement: appointment.idAppointement,
              dateAppointement: new Date(appointment.dateAppointement).toISOString(),
            }));
          
          console.log("Filtered Appointments:", filteredAppointments);
          setAppointments(filteredAppointments);
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
        });
    }
  }, [selectedPatientId]);
  

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    
    try {
      // Convert cost to numeric value (not string)
      const payload = {
        ...data,
        cost: Number(data.cost), // Convert to number instead of string
        dateConsultation: new Date(data.dateConsultation).toISOString()
      };
  
      console.log("Submission Payload:", payload); // Debugging log
  
      const response = await axios.post('http://localhost:4000/api/consultation', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 200) {
        window.alert('Consultation created successfully!');
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
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center dark:bg-gray-900">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-bold mt-8 text-orange-600 dark:text-orange-500 text-center">
            Consultation Sheet
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
      value={watch("idPatient")} // Add value binding
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

  {/* Appointment Selection */}
  <div>
    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-300">
      Appointment
    </label>
    <Select
      onValueChange={(value) => setValue("idAppointement", value)} // Match backend field name
      value={watch("idAppointement")} // Add value binding
      disabled={!selectedPatientId}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an appointment" />
      </SelectTrigger>
      <SelectContent>
        {appointments.map((appointment) => (
          <SelectItem 
            key={appointment.idAppointement} 
            value={appointment.idAppointement}
          >
            {appointment.dateAppointement}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {errors.idAppointement && (
      <p className="text-red-500 text-sm mt-1">{errors.idAppointement.message}</p>
    )}
  </div>
</div>
            

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