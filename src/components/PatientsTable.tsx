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
import { ActivityIcon, GridIcon, ListIcon, CalendarIcon, SearchIcon } from "lucide-react";

interface Patient {
  firstName: string;
  lastName: string;
  gender: string;
  allergy: string;
  bloodType: string;
  appointmentDate: string;
  startTime: string; // Added startTime field
  appointmentType: string;
}

const patients: Patient[] = [
  {
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    allergy: "Peanuts",
    bloodType: "A+",
    appointmentDate: "2024-11-20",
    startTime: "10:00 AM", // Added startTime
    appointmentType: "Routine Check-up",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    gender: "Female",
    allergy: "None",
    bloodType: "O-",
    appointmentDate: "2024-12-10",
    startTime: "02:30 PM", // Added startTime
    appointmentType: "Follow-up",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    gender: "Female",
    allergy: "Shellfish",
    bloodType: "B+",
    appointmentDate: "2024-11-25",
    startTime: "09:15 AM", // Added startTime
    appointmentType: "Emergency",
  },
  {
    firstName: "Bob",
    lastName: "Williams",
    gender: "Male",
    allergy: "Dairy",
    bloodType: "AB+",
    appointmentDate: "2024-12-01",
    startTime: "11:45 AM", // Added startTime
    appointmentType: "1st Visit",
  },
];

const AllergyTag = ({ allergy }: { allergy: string }) => (
  <span className="px-2 py-1 bg-orange-50 text-orange-500 rounded-md text-sm dark:bg-orange-900 dark:text-orange-200">
    {allergy}
  </span>
);

const BloodTypeTag = ({ bloodType }: { bloodType: string }) => (
  <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded-md text-sm dark:bg-blue-900 dark:text-blue-200">
    {bloodType}
  </span>
);

const AppointmentTypeTag = ({ type }: { type: string }) => {
  let colorClass = "";
  switch (type) {
    case "Emergency":
      colorClass = "bg-red-50 text-red-500 dark:bg-red-900 dark:text-red-200";
      break;
    case "Routine Check-up":
      colorClass = "bg-green-50 text-green-500 dark:bg-green-900 dark:text-green-200";
      break;
    case "Follow-up":
      colorClass = "bg-yellow-50 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-200";
      break;
    default:
      colorClass = "bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-200";
  }
  return (
    <span className={`px-2 py-1 rounded-md text-sm ${colorClass}`}>
      {type}
    </span>
  );
};

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
            <div className="text-sm text-gray-500 dark:text-gray-400">{patient.gender}</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <div><strong>Allergy:</strong> <AllergyTag allergy={patient.allergy} /></div>
          <div><strong>Blood Type:</strong> <BloodTypeTag bloodType={patient.bloodType} /></div>
          <div><strong>Appointment Date:</strong> {patient.appointmentDate}</div>
          <div><strong>Start Time:</strong> {patient.startTime}</div> {/* Added startTime */}
          <div><strong>Appointment Type:</strong> <AppointmentTypeTag type={patient.appointmentType} /></div>
        </div>
      </div>
    ))}
  </div>
);

export default function PatientsTable() {
  const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter patients by search query
  const searchedPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.appointmentType.toLowerCase().includes(query) ||
      patient.appointmentDate.includes(query)
    );
  });

  // Sort patients by appointment date (earliest first)
  const sortedPatients = [...searchedPatients].sort((a, b) =>
    new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
  );

  // Filter patients to show only upcoming appointments if the toggle is active
  const filteredPatients = showUpcoming
    ? sortedPatients.filter((patient) => {
        const appointmentDate = new Date(patient.appointmentDate).getTime();
        const currentDate = new Date().getTime();
        return appointmentDate > currentDate; // Only future dates
      })
    : sortedPatients;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Patients List</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, type, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-300" />
          </div>
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
            onClick={() => setShowUpcoming(!showUpcoming)}
          >
            <CalendarIcon className="w-5 h-5" />
            {showUpcoming ? "All Dates" : "Upcoming Dates"}
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
              <TableHead className="text-gray-900 dark:text-gray-100">Gender</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Allergy</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Blood Type</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Appointment Date</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Start Time</TableHead> {/* Added Start Time column */}
              <TableHead className="text-gray-900 dark:text-gray-100">Appointment Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient, index) => (
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
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.gender}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <AllergyTag allergy={patient.allergy} />
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <BloodTypeTag bloodType={patient.bloodType} />
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.appointmentDate}</TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{patient.startTime}</TableCell> {/* Added startTime */}
                <TableCell className="text-gray-900 dark:text-gray-100">
                  <AppointmentTypeTag type={patient.appointmentType} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <PatientsGrid patients={filteredPatients} />
      )}
    </div>
  );
}