// app/components/PatientsTable.tsx
"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ActivityIcon, GridIcon, ListIcon, UsersIcon } from "lucide-react";

interface Patient {
  firstName: string;
  lastName: string;
  diagnosis: string;
  gender: string;
  appointmentDate: string;
  lastVisit: string;
}

const patients: Patient[] = [
  {
    firstName: "John",
    lastName: "Doe",
    diagnosis: "Hypertension",
    gender: "Male",
    appointmentDate: "2024-11-20",
    lastVisit: "2024-10-15",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    diagnosis: "Diabetes",
    gender: "Female",
    appointmentDate: "2024-12-10",
    lastVisit: "2024-11-01",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    diagnosis: "Asthma",
    gender: "Female",
    appointmentDate: "2024-11-25",
    lastVisit: "2024-09-15",
  },
  {
    firstName: "Bob",
    lastName: "Williams",
    diagnosis: "Heart Disease",
    gender: "Male",
    appointmentDate: "2024-12-01",
    lastVisit: "2024-10-20",
  },
];

const DiagnosisTag = ({ diagnosis }: { diagnosis: string }) => (
  <span className="px-2 py-1 bg-orange-50 text-orange-500 rounded-md text-sm dark:bg-orange-900 dark:text-orange-200">
    {diagnosis}
  </span>
);

const PatientInitial = ({ name }: { name: string }) => (
  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
    {name[0]}
  </div>
);

const PatientsGrid = ({ patients }: { patients: Patient[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {patients.map((patient, index) => (
      <div key={index} className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <PatientInitial name={patient.firstName} />
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{patient.firstName} {patient.lastName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{patient.diagnosis}</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <div><strong>Gender:</strong> {patient.gender}</div>
          <div><strong>Appointment Date:</strong> {patient.appointmentDate}</div>
          <div><strong>Last Visit:</strong> {patient.lastVisit}</div>
        </div>
      </div>
    ))}
  </div>
);

export default function PatientsTable() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredPatients = selectedGender
    ? patients.filter((patient) => patient.gender === selectedGender)
    : patients;

  // Sort patients alphabetically by first name
  const sortedPatients = [...filteredPatients].sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Patients List</h2>
        <div className="flex items-center gap-4">
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setViewMode("table")}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
          <button
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSelectedGender(selectedGender === "Female" ? null : "Female")}
          >
            <UsersIcon className="w-5 h-5" />
            Genders
          </button>
          <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
            <ActivityIcon className="w-5 h-5" />
            Diagnoses
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="w-12 text-gray-900 dark:text-gray-100">
                <Checkbox className="text-gray-900 dark:text-gray-100" />
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">First Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Last Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Diagnosis</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Gender</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Appointment Date</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Last Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.map((patient, index) => (
              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <Checkbox className="text-gray-900 dark:text-gray-100" />
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-3">
                    <PatientInitial name={patient.firstName} />
                    {patient.firstName}
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.lastName}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <DiagnosisTag diagnosis={patient.diagnosis} />
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.gender}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.appointmentDate}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.lastVisit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <PatientsGrid patients={sortedPatients} />
      )}
    </div>
  );
}