
import { GoogleGenAI, Type } from "@google/genai";
import { PreliminaryAssessment, PatientData, UrgencyLevel, ExtractedPatientInfo, DiagnosticMedia } from "../types";

const PRO_MODEL = 'gemini-3-pro-preview';
const FLASH_MODEL = 'gemini-3-flash-preview';

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
};

/**
 * Intelligent extraction of patient data from voice input.
 */
export const extractPatientDataFromAudio = async (audioDataUrl: string): Promise<ExtractedPatientInfo> => {
  // Always initialize GoogleGenAI with the named parameter and direct import.meta.env.VITE_GEMINI_API_KEY
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const mimeMatch = audioDataUrl.match(/^data:([^;]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'audio/webm';
  const base64Data = audioDataUrl.split(',')[1];

  try {
    const call = ai.models.generateContent({
      model: FLASH_MODEL,
      contents: {
        parts: [
          { text: "Extract structured medical intake data from this audio. Map findings to these keys: name, age, gender, symptoms, duration, history. Use empty strings if not mentioned. Return ONLY JSON." },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.STRING },
            gender: { type: Type.STRING },
            symptoms: { type: Type.STRING },
            duration: { type: Type.STRING },
            history: { type: Type.STRING },
          }
        }
      }
    });

    const response = await withTimeout(call, 30000, "Audio extraction timed out after 30 seconds");

    // Use the .text property directly (not a method)
    let text = response.text || '{}';
    // Clean up potential markdown code blocks
    text = text.replace(/^```[a-z]*\n?/, '').replace(/```\n?$/, '').trim();

    const data = JSON.parse(text) as ExtractedPatientInfo;

    // Sanitize Age (remove "years" etc)
    if (data.age) {
      data.age = data.age.replace(/\D/g, '');
    }

    return data;
  } catch (error) {
    console.error("Extraction Error:", error);
    return {};
  }
};

export const analyzeMedicalCase = async (
  mediaList: DiagnosticMedia[],
  audioDataUrl: string | null,
  patientData: PatientData
): Promise<PreliminaryAssessment> => {
  // Always initialize GoogleGenAI with the named parameter and direct import.meta.env.VITE_GEMINI_API_KEY
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check VITE_GEMINI_API_KEY in .env.local");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Perform a professional multimodal medical assessment for patient ${patientData.name || 'Anonymous'}.
    
    Patient Intake Data:
    - Age: ${patientData.age}
    - Gender: ${patientData.gender}
    - Reported Symptoms: ${patientData.symptoms}
    - Symptom Duration: ${patientData.duration}
    - Medical History: ${patientData.history}

    Provided diagnostic attachments: ${mediaList.length} files (images/PDFs).
    Provided voice recording: ${audioDataUrl ? "Yes" : "No"}.

    INSTRUCTIONS:
    1. Analyze ALL provided media files collectively.
    2. Generate a comprehensive "Clinical Reasoning Report" in MARKDOWN format.
    3. Use # for major sections, ## for sub-sections, ### for smaller headers, and - for lists.
    4. You may use markdown tables for lab results.
    5. The report should be professional and include Observations, Media Analysis, and Differential Reasoning.
    6. Return the result in the specified JSON format.
  `;

  const contents: any[] = [{ text: prompt }];

  mediaList.forEach(media => {
    const base64Data = media.dataUrl.split(',')[1];
    contents.push({
      inlineData: {
        mimeType: media.type,
        data: base64Data,
      },
    });
  });

  if (audioDataUrl) {
    const mimeMatch = audioDataUrl.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'audio/webm';
    const base64Data = audioDataUrl.split(',')[1];
    contents.push({ inlineData: { mimeType, data: base64Data } });
  }

  try {
    const call = ai.models.generateContent({
      model: PRO_MODEL,
      contents: { parts: contents },
      config: {
        systemInstruction: "You are a world-class senior diagnostic physician. You provide detailed clinical reasoning. Ensure the 'reportHtml' field contains a beautifully structured medical report in MARKDOWN format. Use # for main sections, ## for subsections, ### for field labels. Do NOT use HTML tags. Just clean Markdown.",
        // responseMimeType: "application/json", // Removed due to conflict with Google Search tool
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A one-sentence high-level summary." },
            reportHtml: { type: Type.STRING, description: "Detailed clinical reasoning report in HTML format." },
            potentialConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            urgency: { type: Type.STRING, enum: Object.values(UrgencyLevel) },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING }
          },
          required: ["summary", "reportHtml", "potentialConditions", "urgency", "redFlags", "nextSteps", "disclaimer"]
        },
        tools: [{ googleSearch: {} }]
      },
    });

    const response = await withTimeout(call, 180000, "Medical analysis timed out after 3 minutes. Please try again or provide less data.");

    // Use the .text property directly
    let text = response.text || '{}';
    // Clean up potential markdown code blocks if the model ignores responseMimeType
    // This handles ```json, ```html, or just ``` at the start/end
    text = text.replace(/^```[a-z]*\n?/, '').replace(/```\n?$/, '').trim();

    const result = JSON.parse(text);

    // FORCE CLEANUP: Ensure we have clean inner HTML
    if (result.reportHtml) {
      result.reportHtml = result.reportHtml
        // Remove Markdown code blocks wrapping the HTML
        .replace(/^```html\s*/, '').replace(/```$/, '')
        .replace(/<style>[\s\S]*?<\/style>/gi, '') // Remove styles (we use Tailwind)
        .replace(/<!DOCTYPE html>/gi, '')
        .replace(/<html>/gi, '').replace(/<\/html>/gi, '')
        .replace(/<head>[\s\S]*?<\/head>/gi, '')
        .replace(/<body>/gi, '').replace(/<\/body>/gi, '')
        .trim();
    }

    // Always extract grounding chunks when using googleSearch as per guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      result.groundingSources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }
    return result as PreliminaryAssessment;
  } catch (error: any) {
    console.error("Diagnosis failed:", error);
    // Throw the actual error message to the UI
    throw new Error(`Diagnosis failed: ${error.message || error}`);
  }
};
