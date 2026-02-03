
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Paperclip, Mic, StopCircle, ArrowRight, Loader2, Save, Trash2 } from 'lucide-react';
import PatientForm from './PatientForm';
import Disclaimer from './Disclaimer';
import { PatientData, PreliminaryAssessment, DiagnosticMedia } from '../types';
import { analyzeMedicalCase, extractPatientDataFromAudio } from '../services/geminiService';
import { saveReport } from '../services/firebaseService';
import { useAuth } from '../App';

const NewDiagnosis: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData>({
    name: '', age: '', gender: '', symptoms: '', duration: '', history: '',
  });
  
  const [mediaList, setMediaList] = useState<DiagnosticMedia[]>([]);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsCameraReady(false);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError("Camera access denied.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setMediaList(prev => [...prev, { dataUrl, type: 'image/jpeg', name: `Capture ${Date.now()}` }]);
      stopCamera();
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const url = reader.result as string;
          setAudioFile(url);
          setIsExtracting(true);
          try {
            const extracted = await extractPatientDataFromAudio(url);
            setPatientData(prev => ({ ...prev, ...extracted }));
          } catch (e) {
            console.error("Voice extraction failed");
          } finally {
            setIsExtracting(false);
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const handleAnalyze = async () => {
    if (!patientData.symptoms && mediaList.length === 0) {
      setError("Please provide symptoms or upload diagnostic media.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeMedicalCase(mediaList, audioFile, patientData);
      setIsSaving(true);
      if (user) {
        await saveReport(user.uid, {
          userId: user.uid,
          media: mediaList,
          patientData,
          assessment: result,
          status: 'completed'
        });
      }
      navigate('/dashboard'); // Go back to history to see new report
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">New Clinical Analysis</h1>
           <p className="text-slate-500 font-medium">Cross-analyze diagnostics with multimodal intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-save: Active</span>
           <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        </div>
      </div>

      <Disclaimer />

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Media Control */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-teal-900/5 border border-slate-100">
            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-6">Diagnostic Attachments</h3>
            
            {isCameraActive ? (
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-black mb-4">
                <video ref={videoRef} autoPlay playsInline onPlaying={() => setIsCameraReady(true)} className="w-full h-full object-cover" />
                <button 
                  onClick={capturePhoto} 
                  disabled={!isCameraReady}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full border-4 border-teal-500 flex items-center justify-center disabled:opacity-50"
                >
                   <div className="w-10 h-10 rounded-full border-2 border-slate-100" />
                </button>
              </div>
            ) : mediaList.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {mediaList.map((m, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    {m.type.includes('image') ? <img src={m.dataUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full bg-teal-50"><Paperclip className="text-teal-400" /></div>}
                    <button onClick={() => setMediaList(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-[2rem] border-2 border-dashed border-teal-100 bg-teal-50/20 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 transition-all group mb-6">
                <Paperclip className="w-8 h-8 text-teal-300 group-hover:text-teal-500 mb-3" />
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Attach Files</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={isCameraActive ? stopCamera : startCamera} className="py-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Camera className="w-4 h-4 text-teal-500" /> {isCameraActive ? 'Close' : 'Camera'}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="py-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Paperclip className="w-4 h-4 text-cyan-500" /> Add File
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                const r = new FileReader(); r.onloadend = () => setMediaList(prev => [...prev, { dataUrl: r.result as string, type: f.type, name: f.name }]); r.readAsDataURL(f);
              }
            }} />
          </div>

          <div className="bg-gradient-to-br from-teal-600 to-cyan-700 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
             <h3 className="text-xs font-black text-teal-100 uppercase tracking-widest mb-6">Voice Intake Assistant</h3>
             
             {isRecording ? (
               <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                     <div className="w-10 h-10 bg-white rounded-full shadow-lg" />
                  </div>
                  <button onClick={() => mediaRecorderRef.current?.stop()} className="px-6 py-2 bg-red-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-900/40">Stop Now</button>
               </div>
             ) : isExtracting ? (
               <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Intelligent Profiling...</p>
               </div>
             ) : (
               <button onClick={startRecording} className="w-full flex flex-col items-center gap-6 group/btn">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition duration-300">
                     <Mic className="w-10 h-10 text-teal-600" />
                  </div>
                  <span className="text-sm font-bold opacity-80 group-hover/btn:opacity-100 transition-opacity">Capture Audio Narrative</span>
               </button>
             )}
          </div>
        </div>

        {/* Right: Intake Form */}
        <div className="lg:col-span-8">
           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-white">
              <PatientForm data={patientData} onChange={setPatientData} />
              
              <div className="mt-12 pt-8 border-t border-slate-100">
                 {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
                 
                 <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || isRecording}
                  className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all relative overflow-hidden group ${
                    isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-teal-600 text-white hover:bg-teal-700 hover:-translate-y-1'
                  }`}
                 >
                   {isAnalyzing || isSaving ? (
                     <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Clinical reasoning in progress...</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center gap-3">
                        <span>Analyze & Generate Report</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </div>
                   )}
                 </button>
              </div>
           </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default NewDiagnosis;
