"use client";

import { Users, Calendar } from "lucide-react";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBg: string;
}

const MetricCard = ({ icon, value, label, iconBg }: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-md flex-1 border border-gray-200 dark:border-gray-700">
    <div className={`${iconBg} p-4 rounded-xl flex items-center justify-center`}>{icon}</div>
    <div className="flex-1">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        <CountUp end={value} duration={2} />
      </h2>
      <p className="text-md text-gray-600 dark:text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

export default function DashboardMetrics() {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:4000/api/patient"),
          axios.get("http://localhost:4000/api/appointement"),
        ]);

        if (Array.isArray(patientsRes.data)) {
          setTotalPatients(patientsRes.data.length);
        }

        if (Array.isArray(appointmentsRes.data)) {
          setTotalAppointments(appointmentsRes.data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-6 px-4">
      {/* Metric Cards */}
      <div className="flex flex-row gap-6">
        <MetricCard
          icon={<Users className="w-8 h-8 text-orange-500" />}
          value={totalPatients}
          label="Total Patients"
          iconBg="bg-orange-100"
        />
        <MetricCard
          icon={<Calendar className="w-8 h-8 text-orange-500" />}
          value={totalAppointments}
          label="Total Appointments"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts */}
      <div className="flex flex-row gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md w-2/3 border border-gray-200 dark:border-gray-700">
          <Line
            data={{
              labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              datasets: [
                {
                  label: "Income",
                  data: [
                    1200, 1300, 1150, 1400, 1500, 1600, 1550, 1700, 1650, 1800, 1900, 2000
                  ],
                  backgroundColor: "rgba(249, 115, 22, 0.7)",
                  borderColor: "rgba(249, 115, 22, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md w-1/3 border border-gray-200 dark:border-gray-700">
          <Pie
            data={{
              labels: ["Emergency", "Routine Check-up", "First Visit", "Follow-up"],
              datasets: [
                {
                  data: [30, 40, 15, 15],
                  backgroundColor: [
                    "#FF7F32", // Emergency
                    "#FFA04D", // Routine Check-up
                    "#FFB366", // First Visit
                    "#FFCC80", // Follow-up
                  ],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
}