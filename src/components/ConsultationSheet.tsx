"use client";
import { useState } from 'react';
import axios from 'axios'; // Import axios
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ConsultationSheet() {
  const [formData, setFormData] = useState({
    dateConsultation: '',
    diagnostic: '',
    treatment: '',
    symptoms: '',
    cost: '',
    statusPaiement: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:4000/api/consultation', formData, {
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Consultation Details Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateConsultation" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Consultation Date</label>
                <Input
                  type="date"
                  id="dateConsultation"
                  name="dateConsultation"
                  value={formData.dateConsultation}
                  onChange={handleChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Cost</label>
                <Input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="diagnostic" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Diagnostic</label>
              <Textarea
                id="diagnostic"
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Treatment</label>
              <Textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Symptoms</label>
              <Textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label htmlFor="statusPaiement" className="block text-sm font-medium text-muted-foreground dark:text-gray-300">Payment Status</label>
              <Select
                value={formData.statusPaiement}
                onValueChange={(value) => setFormData({ ...formData, statusPaiement: value })}
                required
              >
                <SelectTrigger className="mt-1 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="Select Payment Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                  <SelectItem value="completed" className="dark:hover:bg-gray-700">Completed</SelectItem>
                  <SelectItem value="pending" className="dark:hover:bg-gray-700">Pending</SelectItem>
                  <SelectItem value="failed" className="dark:hover:bg-gray-700">Failed</SelectItem>
                </SelectContent>
              </Select>
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