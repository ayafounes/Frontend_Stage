"use client";

import { Users, Calendar } from 'lucide-react';
import CountUp from 'react-countup';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
  percentage?: string;
  description?: string;
  chartData?: { name: string; value: number }[];
}

const MetricCard = ({ icon, value, label, iconBg, percentage, description, chartData }: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4 shadow-sm flex-1">
    <div className={`${iconBg} p-3 rounded-lg`}>
      {icon}
    </div>
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? <CountUp end={value} duration={2} /> : value}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {percentage && (
        <div className="mt-2">
          <span className="text-green-500 text-sm font-semibold">{percentage}</span>
          <span className="text-gray-500 text-sm ml-1 dark:text-gray-400">{description}</span>
        </div>
      )}
    </div>
    {chartData && (
      <div className="w-24 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#F97316"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default function DashboardMetrics() {
  const totalPatientsChartData = [
    { name: 'Jan', value: 1000 },
    { name: 'Feb', value: 1200 },
    { name: 'Mar', value: 1400 },
    { name: 'Apr', value: 1600 },
  ];

  const appointmentsChartData = [
    { name: 'Jan', value: 80 },
    { name: 'Feb', value: 90 },
    { name: 'Mar', value: 110 },
    { name: 'Apr', value: 130 },
  ];

  return (
    <div className="flex flex-col gap-6 mt-6 px-4">
      {/* Metric Cards */}
      <div className="flex flex-row gap-6">
        <MetricCard
          icon={<Users className="w-6 h-6 text-orange-500" />}
          value={100}
          label="Total Patients"
          iconBg="bg-orange-50"
          percentage="45.06%"
          description="Increase"
          chartData={totalPatientsChartData}
        />
        
        <MetricCard
          icon={<Calendar className="w-6 h-6 text-orange-500" />}
          value={100}
          label="Appointments"
          iconBg="bg-orange-50"
          percentage="25.06%"
          description="Increase"
          chartData={appointmentsChartData}
        />
      </div>
    </div>
  );
}