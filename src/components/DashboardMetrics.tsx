"use client";

import { Users, Activity, Calendar, Grid, List } from 'lucide-react';
import { useState } from 'react';
import CountUp from 'react-countup';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  diagnosis: string;
  gender: string;
  appointmentDate: string;
  lastVisit: string;
}

const MetricCard = ({ icon, value, label, iconBg }: MetricCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3 shadow-sm w-64">
    <div className={`${iconBg} p-2 rounded-lg`}>
      {icon}
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? <CountUp end={value} duration={2} /> : value}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function DashboardMetrics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<"list" | "grid">("list");

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      diagnosis: 'Hypertension',
      gender: 'Male',
      appointmentDate: '2024-11-20',
      lastVisit: '2024-10-15',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      diagnosis: 'Diabetes',
      gender: 'Female',
      appointmentDate: '2024-12-10',
      lastVisit: '2024-11-01',
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      diagnosis: 'Asthma',
      gender: 'Female',
      appointmentDate: '2024-11-25',
      lastVisit: '2024-09-15',
    },
    {
      id: 4,
      firstName: 'Bob',
      lastName: 'Williams',
      diagnosis: 'Heart Disease',
      gender: 'Male',
      appointmentDate: '2024-12-01',
      lastVisit: '2024-10-20',
    },
    {
      id: 5,
      firstName: 'Mary',
      lastName: 'Miller',
      diagnosis: 'Heart Disease',
      gender: 'Male',
      appointmentDate: '2024-12-01',
      lastVisit: '2024-10-20',
    },
  ]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 mt-6 px-4">
      {/* Metric Cards */}
      <div className="flex flex-row gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5 text-orange-500" />}
          value={45}
          label="Total Patients"
          iconBg="bg-orange-50"
        />
        
        <MetricCard
          icon={<Activity className="w-5 h-5 text-orange-500" />}
          value="Diabetes"
          label="Most Common Diagnosis"
          iconBg="bg-orange-50"
        />
        
        <div className="flex items-center gap-4">
          <MetricCard
            icon={<Calendar className="w-5 h-5 text-orange-500" />}
            value={50}
            label="Upcoming Appointments"
            iconBg="bg-orange-50"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="bg-white dark:bg-gray-800 rounded-lg p-2 pl-10 shadow-sm w-64 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Patients List */}
      {searchQuery && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Matching Patients:
            </h3>
            <button
              onClick={() => setView(view === "list" ? "grid" : "list")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {view === "list" ? <Grid size={20} /> : <List size={20} />}
            </button>
          </div>

          {view === "list" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">First Name</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Last Name</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Diagnosis</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Gender</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Appointment Date</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.firstName}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.lastName}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.diagnosis}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.gender}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.appointmentDate}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{patient.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Diagnosis: {patient.diagnosis}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Gender: {patient.gender}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Appointment: {patient.appointmentDate}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Last Visit: {patient.lastVisit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}