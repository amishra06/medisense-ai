
import React from 'react';
import { PatientData } from '../types';

interface PatientFormProps {
  data: PatientData;
  onChange: (data: PatientData) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
           <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800">Patient Profile</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="e.g. Alexander Pierce"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            name="age"
            value={data.age}
            onChange={handleChange}
            placeholder="Years"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Gender Identity</label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Primary Symptoms & Concerns</label>
        <textarea
          name="symptoms"
          value={data.symptoms}
          onChange={handleChange}
          placeholder="Describe the sensations, location, and severity..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Duration</label>
          <input
            type="text"
            name="duration"
            value={data.duration}
            onChange={handleChange}
            placeholder="e.g. 48 hours"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Known Medical History</label>
          <input
            type="text"
            name="history"
            value={data.history}
            onChange={handleChange}
            placeholder="Allergies, chronic conditions..."
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
