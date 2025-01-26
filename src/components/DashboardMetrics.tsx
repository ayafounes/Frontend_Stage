"use client";

import { Users, Activity, Calendar } from 'lucide-react';
import CountUp from 'react-countup';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
}

const MetricCard = ({ icon, value, label, iconBg }: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-4 shadow-sm flex-1">
    <div className={`${iconBg} p-3 rounded-lg`}>
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? <CountUp end={value} duration={2} /> : value}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function DashboardMetrics() {
  return (
    <div className="flex flex-col gap-6 mt-6 px-4">
      {/* Metric Cards */}
      <div className="flex flex-row gap-6">
        <MetricCard
          icon={<Users className="w-6 h-6 text-orange-500" />}
          value={45}
          label="Total Patients"
          iconBg="bg-orange-50"
        />
        
        <MetricCard
          icon={<Activity className="w-6 h-6 text-orange-500" />}
          value="Diabetes"
          label="Most Common Diagnosis"
          iconBg="bg-orange-50"
        />
        
        <MetricCard
          icon={<Calendar className="w-6 h-6 text-orange-500" />}
          value={50}
          label="Upcoming Appointments"
          iconBg="bg-orange-50"
        />
      </div>
    </div>
  );
}