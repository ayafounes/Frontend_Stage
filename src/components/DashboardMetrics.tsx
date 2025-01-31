"use client";

import { Users, Calendar } from "lucide-react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line as LineChartJS, Pie as PieChartJS } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBg: string;
  percentage?: string;
  description?: string;
  chartData?: { name: string; value: number }[];
}

const MetricCard = ({
  icon,
  value,
  label,
  iconBg,
  percentage,
  description,
  chartData,
}: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-md flex-1 border border-gray-200 dark:border-gray-700">
    <div className={`${iconBg} p-4 rounded-xl flex items-center justify-center`}>{icon}</div>
    <div className="flex-1">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        <CountUp end={value} duration={2} />
      </h2>
      <p className="text-md text-gray-600 dark:text-gray-400 font-medium">{label}</p>
      {percentage && (
        <div className="mt-2">
          <span className="text-green-500 text-sm font-semibold">{percentage}</span>
          <span className="text-gray-500 text-sm ml-1 dark:text-gray-400">{description}</span>
        </div>
      )}
    </div>
    {chartData && (
      <div className="w-28 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default function DashboardMetrics() {
  const totalPatients = 1000;
  const totalAppointments = 150;
  const todayPatients = 20;
  const todayAppointments = 20;

  return (
    <div className="flex flex-col gap-6 mt-6 px-4">
      {/* Metric Cards */}
      <div className="flex flex-row gap-6">
        <MetricCard
          icon={<Users className="w-8 h-8 text-orange-500" />}
          value={todayPatients}
          label="Patients Today"
          iconBg="bg-orange-100"
          percentage="+5%"
          description="since yesterday"
        />
        <MetricCard
          icon={<Calendar className="w-8 h-8 text-orange-500" />}
          value={todayAppointments}
          label="Appointments Today"
          iconBg="bg-orange-100"
          percentage="+3%"
          description="since yesterday"
        />
      </div>

      {/* Charts */}
      <div className="flex flex-row gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md w-2/3 border border-gray-200 dark:border-gray-700">
        <LineChartJS
  data={{
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Income",
        data: [
          1200, 1300, 1150, 1400, 1500, 1600, 1550, 1700, 1650, 1800, 1900, 2000
        ], // Example income data for each month
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
        
        <PieChartJS
        
  data={{
    labels: ["Emergency", "Routine Check-up", "First Visit", "Follow-up"],
    datasets: [
      {
        data: [30, 40, 15, 15], // Example data representing the distribution of today's appointments by type
        backgroundColor: [
          "#FF7F32", // Emergency
          "#FFA04D", // Routine Check-up
          "#FFB366", // First Visit
          "#FFCC80", // Follow-up
        ], // Different shades of orange for each segment
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
