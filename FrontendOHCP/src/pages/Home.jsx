import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, MessageSquare, Stethoscope, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 via-white to-white">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
            Trusted Online Health Consultation <br />
            <span className="text-blue-500">Anytime, Anywhere</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Book virtual appointments, manage your health records, and chat with top doctors from the comfort of your home. HealthTap-style experience for everyone!
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button className="px-8 py-4 text-lg rounded-xl shadow" size="lg">
              Book Appointment
            </Button>
            <Button variant="outline" className="px-8 py-4 text-lg rounded-xl border-blue-400 hover:bg-blue-100" size="lg">
              Find a Doctor
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src="https://www.healthtap.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhome_hero_img.c9e72f7e.png&w=3840&q=75"
            alt="HealthTap Hero"
            className="w-full max-w-lg rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Calendar className="text-blue-500" size={32} />}
          title="Appointments"
          desc="Schedule online consultations with certified doctors easily."
        />
        <FeatureCard
          icon={<User className="text-blue-500" size={32} />}
          title="Expert Doctors"
          desc="Access a network of experienced specialists across fields."
        />
        <FeatureCard
          icon={<FileText className="text-blue-500" size={32} />}
          title="Medical Records"
          desc="Store, upload, and review your health records securely."
        />
        <FeatureCard
          icon={<Brain className="text-blue-500" size={32} />}
          title="AI Diagnosis"
          desc="Receive quick AI-powered symptom analysis and recommendations."
        />
        <FeatureCard
          icon={<MessageSquare className="text-blue-500" size={32} />}
          title="Chat with Doctors"
          desc="Ask questions and get answers through secure messaging."
        />
        <FeatureCard
          icon={<Stethoscope className="text-blue-500" size={32} />}
          title="Video Consult"
          desc="Experience seamless video consultations for better care."
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <StepCard step="1" title="Sign Up" />
          <StepCard step="2" title="Book Appointment" />
          <StepCard step="3" title="Consult & Get Care" />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 mb-4">
          Instant access to trusted healthcare, private and secure, from anywhere in Vietnam. Backed by a team of experienced doctors & cutting-edge AI.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-50 py-6 mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Online Health Consultation Portal. Inspired by HealthTap.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
      <div className="mb-3">{icon}</div>
      <div className="text-xl font-semibold mb-1 text-blue-700">{title}</div>
      <div className="text-gray-500">{desc}</div>
    </div>
  );
}

function StepCard({ step, title }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2">{step}</div>
      <div className="font-medium text-blue-800">{title}</div>
    </div>
  );
}
