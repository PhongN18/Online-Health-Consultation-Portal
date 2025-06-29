import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DoctorConsultationRecordPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [recordType, setRecordType] = useState("visit_summary");
  const [description, setDescription] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await axiosInstance.get(`api/Appointments/${appointmentId}`);
        setAppointment(res.data);
        console.log(res.data)
      } catch (err) {
        navigate("/provider/appointments");
      }
    }
    load();
  }, [appointmentId]);

  const updateMed = (idx, field, value) => {
    const list = [...medications];
    list[idx][field] = value;
    setMedications(list);
  };
  const addMed = () =>
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "" },
    ]);
  const removeMed = (idx) => {
    const list = medications.filter((_, i) => i !== idx);
    setMedications(list);
  };

  const submitRecord = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("PatientId", appointment.patient.userId);
    fd.append("DoctorId", appointment.doctor.userId);
    fd.append("AppointmentId", appointmentId);
    fd.append("RecordType", recordType);
    fd.append("Description", description);

    try {
      await axiosInstance.post("/api/medicalrecords", fd);
      alert("Medical record saved!");
      navigate(`/provider/appointment/${appointmentId}`)
    } catch {
      alert("Error saving medical record.");
    }
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    const payload = {
      AppointmentId: +appointmentId,
      DoctorId: appointment.doctor.userId,
      PatientId: appointment.patient.userId,
      Medications: medications,
      Notes: notes,
    };

    try {
      await axiosInstance.post("/api/prescriptions", payload);
      alert("Prescription created!");
      navigate(`/provider/appointment/${appointmentId}`)
    } catch {
      alert("Error creating prescription.");
    }
  };

  if (!appointment) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <h2 className="text-2xl">
            Consultation with Dr. {appointment.doctor.fullName} — Patient: {appointment.patient.fullName}
          </h2>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="record">
            <TabsList>
              <TabsTrigger value="record">Medical Record & Lab Results</TabsTrigger>
              <TabsTrigger value="prescription">Prescription</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-4 mt-6">
              <form onSubmit={submitRecord} className="space-y-4">
                <div>
                  <Label htmlFor="recordType">Record Type</Label>
                  <Input
                    id="recordType"
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    placeholder="visit_summary / lab_result / imaging"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description / Diagnosis</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter consultation notes and diagnosis..."
                  />
                </div>
                <Button type="submit" className="bg-[var(--primary-blue)] text-white">Save Medical Record</Button>
              </form>
            </TabsContent>

            <TabsContent value="prescription" className="space-y-4 mt-6">
              <form onSubmit={submitPrescription} className="space-y-4">
                {medications.map((m, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 items-end">
                    <div className="col-span-2">
                      <Label>Medicine Name</Label>
                      <Input
                        value={m.name}
                        onChange={(e) => updateMed(i, "name", e.target.value)}
                        placeholder="e.g. Paracetamol"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Dosage</Label>
                      <Input
                        value={m.dosage}
                        onChange={(e) => updateMed(i, "dosage", e.target.value)}
                        placeholder="e.g. 500mg twice a day"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Frequency</Label>
                      <Input
                        value={m.frequency}
                        onChange={(e) => updateMed(i, "frequency", e.target.value)}
                        placeholder="e.g. 2 times/day"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMed(i)}
                      className="bg-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" className="bg-[var(--primary-blue)] text-white" onClick={addMed}>
                  Add Medicine
                </Button>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Take before meals..."
                  />
                </div>
                <Button type="submit" className="bg-[var(--primary-blue)] text-white">Create Prescription</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
      );
}
