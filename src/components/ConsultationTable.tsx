"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityIcon, GridIcon, ListIcon, CalendarIcon, SearchIcon, MoreVertical, Trash2, Eye, Edit } from "lucide-react";

interface Consultation {
  idConsultation: string;
  idPatient: string;
  dateConsultation: string;
  diagnostic: string;
  treatment: string;
  symptoms: string;
  cost: string;
}

interface Patient {
  idPatient: string;
  firstName: string;
  lastName: string;
}

const DiagnosticTag = ({ diagnostic }: { diagnostic: string }) => (
  <span className="px-2 py-1 bg-blue-50 text-blue-500 rounded-md text-sm dark:bg-blue-900 dark:text-blue-200">
    {diagnostic}
  </span>
);

const SymptomsTag = ({ symptoms }: { symptoms: string }) => (
  <span className="px-2 py-1 bg-green-50 text-green-500 rounded-md text-sm dark:bg-green-900 dark:text-green-200">
    {symptoms}
  </span>
);

const PatientInitial = ({ name }: { name: string }) => (
  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
    {name[0]}
  </div>
);

const ConsultationModal = ({ consultation, patient, onClose }: { 
  consultation: Consultation | null, 
  patient: Patient | null,
  onClose: () => void 
}) => {
  if (!consultation || !patient) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Consultation Details</h3>
        <div className="space-y-2">
          <div><strong>Patient:</strong> {patient.firstName} {patient.lastName}</div>
          <div><strong>Date:</strong> {new Date(consultation.dateConsultation).toLocaleDateString()}</div>
          <div><strong>Diagnostic:</strong> {consultation.diagnostic}</div>
          <div><strong>Symptoms:</strong> {consultation.symptoms}</div>
          <div><strong>Treatment:</strong> {consultation.treatment}</div>
          <div><strong>Cost:</strong> {consultation.cost}</div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-orange-500 text-white px-4 py-2 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

const EditConsultationModal = ({ 
  consultation, 
  patient,
  onClose, 
  onSave 
}: { 
  consultation: Consultation | null,
  patient: Patient | null,
  onClose: () => void,
  onSave: (updatedPatient: Patient, updatedConsultation: Consultation) => void 
}) => {
  const [formDataPatient, setFormDataPatient] = useState<Patient>({ idPatient: "", firstName: "", lastName: "" });
  const [formDataConsultation, setFormDataConsultation] = useState<Consultation>({
    idConsultation: "",
    idPatient: "",
    dateConsultation: "",
    diagnostic: "",
    treatment: "",
    symptoms: "",
    cost: ""
  });

  useEffect(() => {
    if (consultation && patient) {
      setFormDataConsultation(consultation);
      setFormDataPatient(patient);
    }
  }, [consultation, patient]);

  const handleSubmit = async () => {
    onSave(formDataPatient, formDataConsultation);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Consultation</h3>
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
          <div>
            <label className="block text-sm font-medium mb-1">Treatment</label>
            <input
              type="text"
              value={formDataConsultation.treatment}
              onChange={(e) => setFormDataConsultation({ ...formDataConsultation, treatment: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Diagnostic</label>
            <input
              type="text"
              value={formDataConsultation.diagnostic}
              onChange={(e) => setFormDataConsultation({ ...formDataConsultation, diagnostic: e.target.value })}
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

export default function ConsultationsTable() {
  const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [editingData, setEditingData] = useState<{ consultation: Consultation | null, patient: Patient | null }>({ 
    consultation: null, 
    patient: null 
  });

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown menu

  // Click-outside handler
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
        const [patientsRes, consultationsRes] = await Promise.all([
          axios.get('http://localhost:4000/api/patient'),
          axios.get('http://localhost:4000/api/consultation')
        ]);

        setPatients(patientsRes.data);
        setConsultations(consultationsRes.data.map((c: any) => ({
          ...c,
          dateConsultation: new Date(c.dateConsultation).toISOString()
        })));
      } catch (error: any) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/consultation/${id}`);
      setConsultations(consultations.filter(c => c.idConsultation !== id));
    } catch (error) {
      alert("Error deleting consultation");
    }
  };

  const handleSave = async (updatedPatient: Patient, updatedConsultation: Consultation) => {
    try {
      await axios.put(`http://localhost:4000/api/patient/${updatedPatient.idPatient}`, updatedPatient);
      await axios.put(`http://localhost:4000/api/consultation/${updatedConsultation.idConsultation}`, updatedConsultation);
      
      setPatients(patients.map(p => p.idPatient === updatedPatient.idPatient ? updatedPatient : p));
      setConsultations(consultations.map(c => 
        c.idConsultation === updatedConsultation.idConsultation ? updatedConsultation : c
      ));
    } catch (error) {
      alert("Error saving changes");
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const patient = patients.find(p => p.idPatient === c.idPatient);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : "";
    return (
      patientName.includes(searchQuery.toLowerCase()) ||
      c.diagnostic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.treatment.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Consultations List</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient, diagnostic, or date..."
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
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
          <button
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setShowUpcoming(!showUpcoming)}
          >
            <CalendarIcon className="w-5 h-5" />
            {showUpcoming ? "All Dates" : "Upcoming Dates"}
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-700">
            <TableHead>Patient</TableHead>
            <TableHead>Diagnostic</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredConsultations.map(consultation => {
            const patient = patients.find(p => p.idPatient === consultation.idPatient);
            return (
              <TableRow key={consultation.idConsultation}>
                <TableCell className="flex items-center gap-2">
                  <PatientInitial name={patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"} />
                  {patient?.firstName} {patient?.lastName}
                </TableCell>
                <TableCell><DiagnosticTag diagnostic={consultation.diagnostic} /></TableCell>
                <TableCell>{consultation.treatment}</TableCell>
                <TableCell>{new Date(consultation.dateConsultation).toLocaleDateString()}</TableCell>
                <TableCell>{consultation.cost}</TableCell>
                <TableCell className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === consultation.idConsultation ? null : consultation.idConsultation);
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenuId === consultation.idConsultation && (
                    <div 
                      ref={dropdownRef} // Attach the ref to the dropdown menu
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10"
                    >
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        <Eye className="inline mr-2 w-4 h-4" /> View
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setEditingData({ consultation, patient: patient || null })}
                      >
                        <Edit className="inline mr-2 w-4 h-4" /> Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          if (confirm("Delete this consultation?")) {
                            handleDelete(consultation.idConsultation);
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

      {selectedConsultation && (
        <ConsultationModal
          consultation={selectedConsultation}
          patient={patients.find(p => p.idPatient === selectedConsultation.idPatient) || null}
          onClose={() => setSelectedConsultation(null)}
        />
      )}

      {editingData.consultation && editingData.patient && (
        <EditConsultationModal
          consultation={editingData.consultation}
          patient={editingData.patient}
          onClose={() => setEditingData({ consultation: null, patient: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}