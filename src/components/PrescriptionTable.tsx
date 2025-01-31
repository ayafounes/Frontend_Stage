"use client";
import { useState, useEffect, useRef } from "react"; // Added useRef
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GridIcon, ListIcon, SearchIcon, MoreVertical, Trash2, Eye, Edit } from "lucide-react";

interface Prescription {
  idPrescription: string;
  idPatient: string;
  patientFullName: string;
  datePrescription: string;
  nameMedication: string;
  typeMedication: string;
  treatment: string;
}

interface Patient {
  idPatient: string;
  firstName: string;
  lastName: string;
}

const MedicationTag = ({ name }: { name: string }) => (
  <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded-md text-sm dark:bg-blue-900 dark:text-blue-200">
    {name}
  </span>
);

const TreatmentTag = ({ treatment }: { treatment: string }) => (
  <span className="px-2 py-1 bg-green-50 text-green-500 rounded-md text-sm dark:bg-green-900 dark:text-green-200">
    {treatment}
  </span>
);

const PatientInitial = ({ name }: { name: string }) => (
  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
    {name[0]}
  </div>
);

const PrescriptionModal = ({ prescription, onClose }: { 
  prescription: Prescription | null, 
  onClose: () => void 
}) => {
  if (!prescription) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Prescription Details</h3>
        <div className="space-y-2">
          <div><strong>Patient:</strong> {prescription.patientFullName}</div>
          <div><strong>Date:</strong> {new Date(prescription.datePrescription).toLocaleDateString()}</div>
          <div><strong>Medication:</strong> {prescription.nameMedication}</div>
          <div><strong>Type:</strong> {prescription.typeMedication}</div>
          <div><strong>Treatment:</strong> {prescription.treatment}</div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-orange-500 text-white px-4 py-2 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

const EditPrescriptionModal = ({ 
  patient,
  onClose, 
  onSave 
}: { 
  patient: Patient | null,
  onClose: () => void,
  onSave: (updatedPatient: Patient) => void 
}) => {
  const [formDataPatient, setFormDataPatient] = useState<Patient>({ idPatient: "", firstName: "", lastName: "" });

  useEffect(() => {
    if (patient) {
      setFormDataPatient(patient);
    }
  }, [patient]);

  const handleSubmit = async () => {
    onSave(formDataPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Patient Name</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Patient First Name</label>
            <input
              type="text"
              value={formDataPatient.firstName}
              onChange={(e) => setFormDataPatient({ ...formDataPatient, firstName: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Patient Last Name</label>
            <input
              type="text"
              value={formDataPatient.lastName}
              onChange={(e) => setFormDataPatient({ ...formDataPatient, lastName: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default function PrescriptionTable() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{ key: keyof Prescription; direction: "asc" | "desc" }>({
    key: "patientFullName",
    direction: "asc",
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenuId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, prescriptionsRes, consultationsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/patient'),
          axios.get('http://localhost:4000/api/prescreption'),
          axios.get('http://localhost:4000/api/consultation')
        ]);

        const patientsData = patientsRes.data;
        const prescriptionsData = prescriptionsRes.data;
        const consultationsData = consultationsRes.data;

        const mergedPrescriptions = prescriptionsData.map((prescription: any) => {
          const patient = patientsData.find((p: any) => p.idPatient === prescription.idPatient);
          const consultation = consultationsData.find((c: any) => c.idPatient === prescription.idPatient);

          return {
            ...prescription,
            patientFullName: patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient",
            treatment: consultation ? consultation.treatment : "N/A",
          };
        });

        setPatients(patientsData);
        setPrescriptions(mergedPrescriptions);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/prescreption/${id}`);
      setPrescriptions(prescriptions.filter(p => p.idPrescription !== id));
    } catch (error) {
      alert("Error deleting prescription");
    }
  };

  const handleSave = async (updatedPatient: Patient) => {
    try {
      // Update patient
      await axios.put(`http://localhost:4000/api/patient/${updatedPatient.idPatient}`, updatedPatient);
      
      // Update state
      setPatients(patients.map(p => p.idPatient === updatedPatient.idPatient ? updatedPatient : p));
      
      // Update prescriptions with the new patient name
      setPrescriptions(prescriptions.map(p => 
        p.idPatient === updatedPatient.idPatient 
          ? { ...p, patientFullName: `${updatedPatient.firstName} ${updatedPatient.lastName}` } 
          : p
      ));
    } catch (error) {
      alert("Error saving changes");
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.patientFullName.toLowerCase().includes(query) ||
      p.nameMedication.toLowerCase().includes(query) ||
      p.typeMedication.toLowerCase().includes(query) ||
      p.treatment.toLowerCase().includes(query)
    );
  });

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Prescription) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prescriptions List</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient, medication, or treatment..."
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
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setViewMode("grid")}
          >
            <GridIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead onClick={() => handleSort("patientFullName")}>Patient</TableHead>
              <TableHead onClick={() => handleSort("nameMedication")}>Medication</TableHead>
              <TableHead onClick={() => handleSort("typeMedication")}>Type</TableHead>
              <TableHead onClick={() => handleSort("treatment")}>Treatment</TableHead>
              <TableHead onClick={() => handleSort("datePrescription")}>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPrescriptions.map((prescription) => {
              const patient = patients.find(p => p.idPatient === prescription.idPatient);
              return (
                <TableRow key={prescription.idPrescription} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <PatientInitial name={prescription.patientFullName} />
                      <div className="font-medium">{prescription.patientFullName}</div>
                    </div>
                  </TableCell>
                  <TableCell><MedicationTag name={prescription.nameMedication} /></TableCell>
                  <TableCell>{prescription.typeMedication}</TableCell>
                  <TableCell><TreatmentTag treatment={prescription.treatment} /></TableCell>
                  <TableCell>{new Date(prescription.datePrescription).toLocaleDateString()}</TableCell>
                  <TableCell className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === prescription.idPrescription ? null : prescription.idPrescription);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === prescription.idPrescription && (
                      <div 
                        ref={dropdownRef} // Attach the ref to the dropdown menu
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
                      >
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          <Eye className="inline mr-2 w-4 h-4" /> View
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setEditingPatient(patient || null)}
                        >
                          <Edit className="inline mr-2 w-4 h-4" /> Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => {
                            if (confirm("Delete this prescription?")) {
                              handleDelete(prescription.idPrescription);
                            }
                          }}
                        >
                          <Trash2 className="inline mr-2 w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="p-4">
          {/* Grid view implementation */}
        </div>
      )}

      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}

      {editingPatient && (
        <EditPrescriptionModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}