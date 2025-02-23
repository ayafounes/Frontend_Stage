"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ActivityIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";

interface Patient {
  idPatient: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  email: string;
  phone: string;
  adress: string;
  city: string;
  country: string;
  postalCode: string;
  allergy: string;
  bloodType: string;
}

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

const PatientInitial = ({ name }: { name: string }) => (
  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
    {name[0]}
  </div>
);

////////////////////
// VIEW MODAL
////////////////////
const PatientModal = ({
  patient,
  onClose,
}: {
  patient: Patient | null;
  onClose: () => void;
}) => {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
        <div className="space-y-2">
          <div>
            <strong>Name:</strong> {patient.firstName} {patient.lastName}
          </div>
          <div>
            <strong>Birth Date:</strong>{" "}
            {new Date(patient.birthDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Gender:</strong> {patient.gender}
          </div>
          <div>
            <strong>Phone:</strong> {patient.phone}
          </div>
          <div>
            <strong>Email:</strong> {patient.email}
          </div>
          <div>
            <strong>Address:</strong> {patient.adress}, {patient.city},{" "}
            {patient.country}
          </div>
          <div>
            <strong>Occupation:</strong> {patient.occupation}
          </div>
          <div>
            <strong>Marital Status:</strong> {patient.maritalStatus}
          </div>
          <div>
            <strong>Blood Type:</strong> {patient.bloodType}
          </div>
          <div>
            <strong>Allergy:</strong> {patient.allergy}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

////////////////////
// EDIT MODAL
////////////////////
const EditPatientModal = ({
  patient,
  onClose,
  onSave,
}: {
  patient: Patient | null;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}) => {
  const [formData, setFormData] = useState<Patient | null>(null);

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        {/* Additional fields can be added here */}
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 text-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

////////////////////
// GRID COMPONENT (Icons only)
////////////////////
interface PatientsGridProps {
  patients: Patient[];
  onDelete: (id: string) => void;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}

const PatientsGrid = ({
  patients,
  onDelete,
  onView,
  onEdit,
}: PatientsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {patients.map((patient) => (
        <div
          key={patient.idPatient}
          className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-3">
            <PatientInitial name={patient.firstName} />
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {patient.gender} •{" "}
                {new Date(patient.birthDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div>
              <strong>Phone:</strong> {patient.phone || "-"}
            </div>
            <div>
              <strong>Email:</strong> {patient.email || "-"}
            </div>
            <div>
              <strong>Address:</strong> {patient.adress}, {patient.city},{" "}
              {patient.country}
            </div>
            <div>
              <strong>Occupation:</strong> {patient.occupation || "-"}
            </div>
            <div>
              <strong>Marital Status:</strong> {patient.maritalStatus || "-"}
            </div>
            <div>
              <strong>Blood Type:</strong>{" "}
              <BloodTypeTag bloodType={patient.bloodType} />
            </div>
            <div>
              <strong>Allergy:</strong>{" "}
              <AllergyTag allergy={patient.allergy} />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => onView(patient)}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this patient?")
                ) {
                  onDelete(patient.idPatient);
                }
              }}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

////////////////////
// MAIN COMPONENT
////////////////////
export default function PatientsTable() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // For table view dropdown actions
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/patient");
        setPatients(response.data);
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePatient = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/patient/${id}`);
      setPatients(patients.filter((patient) => patient.idPatient !== id));
      alert("Patient deleted successfully");
    } catch (error) {
      alert("Error deleting patient");
    }
  };

  const handleEditPatient = async (updatedPatient: Patient) => {
    try {
      await axios.put(
        `http://localhost:4000/api/patient/${updatedPatient.idPatient}`,
        updatedPatient
      );
      setPatients(
        patients.map((patient) =>
          patient.idPatient === updatedPatient.idPatient
            ? updatedPatient
            : patient
        )
      );
      alert("Patient updated successfully");
    } catch (error) {
      alert("Error updating patient");
    }
  };

  const searchedPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.city.toLowerCase().includes(query) ||
      patient.country.toLowerCase().includes(query) ||
      patient.occupation?.toLowerCase().includes(query) ||
      patient.maritalStatus?.toLowerCase().includes(query)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      {/* Header with Search and View Mode toggles */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Patients List
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, phone, email, or city..."
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
          <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
            <ActivityIcon className="w-5 h-5" />
            Medical History
          </button>
        </div>
      </div>

      {/* Render Table or Grid view based on viewMode */}
      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="w-12 text-gray-900 dark:text-gray-100">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Patient
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Gender
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Birth Date
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Phone
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Email
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Address
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Blood Type
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Allergy
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchedPatients.map((patient) => (
              <TableRow
                key={patient.idPatient}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PatientInitial name={patient.firstName} />
                    <div>
                      <div className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {patient.occupation || "No occupation specified"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  {new Date(patient.birthDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email || "-"}</TableCell>
                <TableCell>
                  {patient.adress}, {patient.city}, {patient.country}
                </TableCell>
                <TableCell>
                  <BloodTypeTag bloodType={patient.bloodType} />
                </TableCell>
                <TableCell>
                  <AllergyTag allergy={patient.allergy} />
                </TableCell>
                <TableCell className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === patient.idPatient ? null : patient.idPatient
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === patient.idPatient && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => setEditingPatient(patient)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => {
                          if (
                            confirm("Are you sure you want to delete this patient?")
                          ) {
                            handleDeletePatient(patient.idPatient);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <PatientsGrid
          patients={searchedPatients}
          onDelete={handleDeletePatient}
          onView={setSelectedPatient}
          onEdit={setEditingPatient}
        />
      )}

      {/* Render modals if a patient is selected for view or edit */}
      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleEditPatient}
        />
      )}
    </div>
  );
}
