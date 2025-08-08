// src/data/sampleData.ts

export interface Entity {
  id: string;
  label: string;
  color: string;
  description: string;
}

export interface Annotation {
  id: string;
  start: number;
  end: number;
  text: string;
  entity: string;
}

export const SAMPLE_TEXT: string = `Der Patient Dr. Schmidt wurde am 15. März 2024 mit akuten Schlaganfall-Symptomen in die Klinik München eingeliefert. Die Computertomographie-Angiographie zeigte eine Okklusion der Arteria cerebri media mit einem TICI-Score von 0.

Nach der mechanischen Thrombektomie durch Dr. Weber konnte eine vollständige Reperfusion erreicht werden, was einem TICI-Score von 3 entspricht. Die Behandlung erfolgte unter der Leitung von Prof. Müller in der neurointensiven Abteilung.

Der Patient Hans Meier zeigte nach dem Eingriff deutliche Verbesserungen. Die Kontroll-Bildgebung bestätigte den Behandlungserfolg mit TICI 2b. Die Nachsorge wird in der Neurologischen Klinik Hamburg fortgesetzt.`;

// Minimal entity set for sample demo
export const DEFAULT_ENTITIES: Entity[] = [
  { 
    id: 'person', 
    label: 'PERSON', 
    color: '#FF6B6B', 
    description: 'Patient and physician names (e.g. Dr. Schmidt, Hans Meier)' 
  },
  { 
    id: 'medical_score', 
    label: 'MEDICAL_SCORE', 
    color: '#4ECDC4', 
    description: 'Medical scoring systems (e.g. TICI 2b, NIHSS 10)' 
  },
  { 
    id: 'procedure', 
    label: 'PROCEDURE', 
    color: '#FF9FF3', 
    description: 'Procedures or treatments (e.g. Thrombektomie)' 
  },
  { 
    id: 'diagnosis', 
    label: 'DIAGNOSIS', 
    color: '#FDCB6E', 
    description: 'Diagnoses or conditions (e.g. Schlaganfall, Okklusion)' 
  }
];

// Sample annotations for UI demo
export const SAMPLE_ANNOTATIONS: Annotation[] = [
  {
    id: '1',
    start: 12,
    end: 23,
    text: 'Dr. Schmidt',
    entity: 'person'
  },
  {
    id: '2',
    start: 113,
    end: 123,
    text: 'TICI-Score',
    entity: 'medical_score'
  },
  {
    id: '3',
    start: 134,
    end: 135,
    text: '0',
    entity: 'medical_score'
  },
  {
    id: '4',
    start: 160,
    end: 182,
    text: 'mechanischen Thrombektomie',
    entity: 'procedure'
  },
  {
    id: '5',
    start: 189,
    end: 199,
    text: 'Dr. Weber',
    entity: 'person'
  },
  {
    id: '6',
    start: 285,
    end: 295,
    text: 'TICI-Score',
    entity: 'medical_score'
  },
  {
    id: '7',
    start: 300,
    end: 301,
    text: '3',
    entity: 'medical_score'
  },
  {
    id: '8',
    start: 325,
    end: 337,
    text: 'Prof. Müller',
    entity: 'person'
  },
  {
    id: '9',
    start: 354,
    end: 371,
    text: 'neurointensiven Abteilung',
    entity: 'diagnosis'
  },
  {
    id: '10',
    start: 438,
    end: 448,
    text: 'Hans Meier',
    entity: 'person'
  },
  {
    id: '11',
    start: 520,
    end: 528,
    text: 'TICI 2b',
    entity: 'medical_score'
  }
];
