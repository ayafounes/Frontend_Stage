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
import {
  ActivityIcon,
  GridIcon,
  ListIcon,
  CalendarIcon,
  SearchIcon,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";

interface Appointment {
  idAppointement: string;
  idPatient: string;
  patientFullName: string;
  dateAppointement: string;
  description: string;
  startTime: string;
  endTime: string;
  typeAppointement: string;
}

const PatientInitial = ({ name }: { name: string }) => (
  <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm font-medium dark:bg-orange-900 dark:text-orange-200">
    {name[0]}
  </div>
);

const getTypeColor = (type: string) => {
  switch (type) {
    case "emergency":
      return "bg-red-50 text-red-500 dark:bg-red-900 dark:text-red-200";
    case "Check-up":
      return "bg-green-50 text-green-500 dark:bg-green-900 dark:text-green-200";
    case "follow-up":
      return "bg-yellow-50 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-200";
    case "first-visit":
      return "bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "";
  }
};

const AppointmentModal = ({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Appointment Information</h3>
        <div className="space-y-2">
          <div>
            <strong>Patient:</strong> {appointment.patientFullName}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {new Date(appointment.dateAppointement).toLocaleDateString()}
          </div>
          <div>
            <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
          </div>
          <div>
            <strong>Type:</strong> {appointment.typeAppointement}
          </div>
          <div>
            <strong>Description:</strong> {appointment.description}
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

const EditAppointmentModal = ({
  appointment,
  onClose,
  onSave,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (updatedAppointment: Appointment) => void;
}) => {
  const [formData, setFormData] = useState<Appointment | null>(null);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Appointment</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient Full Name
          </label>
          <input
            type="text"
            name="patientFullName"
            value={formData.patientFullName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Appointment Date
          </label>
          <input
            type="date"
            name="dateAppointement"
            value={formData.dateAppointement.split("T")[0]} // Assuming ISO format
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
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

export default function AppointmentsTable() {
  const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:4000/api/patient"),
          axios.get("http://localhost:4000/api/appointement"),
        ]);

        const patientsData = patientsRes.data;
        const appointmentsData = appointmentsRes.data;

        const mergedAppointments = appointmentsData.map((appointment: any) => {
          const patient = patientsData.find(
            (p: any) => p.idPatient === appointment.idPatient
          );

          return {
            ...appointment,
            patientFullName: patient
              ? `${patient.firstName} ${patient.lastName}`
              : "Unknown Patient",
            dateAppointement: appointment.dateAppointement,
            startTime: appointment.startTime.slice(0, 5),
            endTime: appointment.endTime.slice(0, 5),
          };
        });

        setAppointments(mergedAppointments);
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteAppointment = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/appointement/${id}`);
      setAppointments(
        appointments.filter(
          (appointment) => appointment.idAppointement !== id
        )
      );
      alert("Appointment deleted successfully");
    } catch (error) {
      alert("Error deleting appointment");
    }
  };

  const handleEditAppointment = async (updatedAppointment: Appointment) => {
    try {
      await axios.put(
        `http://localhost:4000/api/appointement/${updatedAppointment.idAppointement}`,
        updatedAppointment
      );
      setAppointments(
        appointments.map((appointment) =>
          appointment.idAppointement === updatedAppointment.idAppointement
            ? updatedAppointment
            : appointment
        )
      );
      alert("Appointment updated successfully");
    } catch (error) {
      alert("Error updating appointment");
    }
  };

  // First filter appointments by the search query.
  const searchedAppointments = appointments.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    return (
      appointment.patientFullName.toLowerCase().includes(query) ||
      (appointment.description &&
        appointment.description.toLowerCase().includes(query)) ||
      appointment.typeAppointement.toLowerCase().includes(query) ||
      appointment.dateAppointement.toLowerCase().includes(query)
    );
  });

  // Then, if "Upcoming Dates" is toggled, filter further to only include appointments with a date today or in the future.
  const filteredAppointments = searchedAppointments.filter((appointment) => {
    if (showUpcoming) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(appointment.dateAppointement);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }
    return true;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 mt-6">
      {/* Header with search and view mode buttons */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Appointments List
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient, type, or date..."
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
          
        </div>
      </div>

      {/* Conditionally render Table or Grid view using filteredAppointments */}
      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="text-gray-900 dark:text-gray-100">
                Patient
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Appointment Type
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Appointment Date
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Time
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Description
              </TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow
                key={appointment.idAppointement}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PatientInitial name={appointment.patientFullName} />
                    <div className="font-medium">
                      {appointment.patientFullName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${getTypeColor(
                      appointment.typeAppointement
                    )}`}
                  >
                    {appointment.typeAppointement || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(appointment.dateAppointement).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {appointment.startTime} - {appointment.endTime}
                </TableCell>
                <TableCell>{appointment.description || "-"}</TableCell>
                <TableCell className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === appointment.idAppointement
                          ? null
                          : appointment.idAppointement
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === appointment.idAppointement && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => setEditingAppointment(appointment)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this appointment?"
                            )
                          ) {
                            handleDeleteAppointment(
                              appointment.idAppointement
                            );
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
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.idAppointement}
              className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow"
            >
              <div className="flex items-center gap-3">
                <PatientInitial name={appointment.patientFullName} />
                <div className="font-medium">
                  {appointment.patientFullName}
                </div>
              </div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-md text-sm ${getTypeColor(
                    appointment.typeAppointement
                  )}`}
                >
                  {appointment.typeAppointement || "-"}
                </span>
              </div>
              <div className="mt-2">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.dateAppointement).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
                </div>
              </div>
              <div className="mt-2">
                <strong>Description:</strong> {appointment.description || "-"}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingAppointment(appointment)}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete this appointment?"
                      )
                    ) {
                      handleDeleteAppointment(appointment.idAppointement);
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
      )}

      {/* Modals */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleEditAppointment}
        />
      )}
    </div>
  );
}
