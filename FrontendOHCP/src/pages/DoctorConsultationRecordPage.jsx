import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "@/components/ui/upload";

export default function DoctorConsultationRecordPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [recordType, setRecordType] = useState("visit_summary");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // switch from duration → frequency
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);

  const [notes, setNotes] = useState("");
  const token = localStorage.getItem("token");
  

  // 1. Fetch appointment details (including doctor & patient)
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/appointments/${appointmentId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return navigate("/provider/appointments");
      const data = await res.json();
      setAppointment(data);
    }
    load();
  }, [appointmentId]);

  // 2. Handle medication list updates
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

  // 3. Submit Medical Record
  const submitRecord = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("PatientId", appointment.patient.userId);
    fd.append("DoctorId", appointment.doctor.userId);
    fd.append("AppointmentId", appointmentId);
    fd.append("RecordType", recordType);
    fd.append("Description", description);
    if (file) fd.append("File", file);

    const res = await fetch(`/api/medicalrecords`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (res.ok) alert("Medical record saved!");
    else alert("Error saving medical record.");
  };

  // 4. Submit Prescription
  const submitPrescription = async (e) => {
    e.preventDefault();
    const payload = {
      AppointmentId: +appointmentId,
      DoctorId: appointment.doctor.userId,
      PatientId: appointment.patient.userId,
      Medications: medications,
      Notes: notes,
    };
    const res = await fetch(`/api/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) alert("Prescription created!");
    else alert("Error creating prescription.");
  };

  if (!appointment) return <div>Loading...</div>;

    return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl">
          Consultation with Dr. {appointment.doctor.firstName}{" "}
          {appointment.doctor.lastName} — Patient:{" "}
          {appointment.patient.firstName}{" "}
          {appointment.patient.lastName}
        </h2>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="record">
          <TabsList>
            <TabsTrigger value="record">
              Medical Record & Lab Results
            </TabsTrigger>
            <TabsTrigger value="prescription">Prescription</TabsTrigger>
          </TabsList>

          {/* -- Tab 1: Medical Record -- */}
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
              <div>
                <Label>Upload Lab Result</Label>
                <Upload onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <Button type="submit">Save Medical Record</Button>
            </form>
          </TabsContent>

          {/* -- Tab 2: Prescription -- */}
          <TabsContent value="prescription" className="space-y-4 mt-6">
            <form onSubmit={submitPrescription} className="space-y-4">
              {medications.map((m, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Medicine Name</Label>
                    <Input
                      value={m.name}
                      onChange={(e) => updateMed(i, "name", e.target.value)}
                      placeholder="e.g. Paracetamol"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={m.dosage}
                      onChange={(e) => updateMed(i, "dosage", e.target.value)}
                      placeholder="e.g. 500mg twice a day"
                    />
                  </div>
                  <div>
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
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addMed}>
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
              <Button type="submit">Create Prescription</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
