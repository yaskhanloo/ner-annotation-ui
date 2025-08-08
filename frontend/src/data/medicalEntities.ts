// Enhanced medical entity types for German stroke intervention reports
export interface MedicalEntity {
  id: string;
  label: string;
  color: string;
  description: string;
}

export interface AnnotationSample {
  text: string;
  entity: string;
  start: number;
  end: number;
}

export const MEDICAL_ENTITIES: MedicalEntity[] = [
  {
    id: 'person',
    label: 'PERSON',
    color: '#FF6B6B',
    description: 'Patient or physician names (Dr. Piechowiak, Lucie Gauch)'
  },
  {
    id: 'procedure',
    label: 'PROCEDURE',
    color: '#FF9FF3',
    description: 'Medical interventions and procedures (Thrombektomie, CT, IA-Thrombolyse)'
  },
  {
    id: 'device',
    label: 'DEVICE',
    color: '#48DBFB',
    description: 'Medical tools, instruments, and stents (Solitaire, Trevo Trak 21, Cerebase)'
  },
  {
    id: 'vessel',
    label: 'VESSEL',
    color: '#FECA57',
    description: 'Arteries and veins (ICA links, A. subclavia, M1-Segment)'
  },
  {
    id: 'diagnosis',
    label: 'DIAGNOSIS',
    color: '#FDCB6E',
    description: 'Conditions or findings (Tandemverschluss, Stenose, ICAD)'
  },
  {
    id: 'medical_score',
    label: 'MEDICAL_SCORE',
    color: '#96CEB4',
    description: 'Medical scoring systems (TICI 2c, NIHSS 15, mRS 3)'
  },
  {
    id: 'symptom',
    label: 'SYMPTOM',
    color: '#FD79A8',
    description: 'Symptoms or clinical signs (Hemiparese, Sprachstörung)'
  },
  {
    id: 'anesthesia',
    label: 'ANESTHESIA',
    color: '#A29BFE',
    description: 'Type of anesthesia used (Intubationsnarkose, Lokalanästhesie)'
  },
  {
    id: 'medication',
    label: 'MEDICATION',
    color: '#4ECDC4',
    description: 'Drugs or agents used (rtPA, Heparin, Aspirin)'
  },
  {
    id: 'dosage',
    label: 'DOSAGE',
    color: '#45B7D1',
    description: 'Drug amounts and formulations (0.9mg/kg, 100ml)'
  },
  {
    id: 'time',
    label: 'TIME',
    color: '#54A0FF',
    description: 'Times and durations (12:42, 2 Stunden, 90 Minuten)'
  },
  {
    id: 'measurement',
    label: 'MEASUREMENT',
    color: '#5F27CD',
    description: 'Vital signs and physical values (180/90 mmHg, 37.5°C)'
  },
  {
    id: 'bedrest',
    label: 'BEDREST',
    color: '#B53471',
    description: 'Post-procedural rest or positioning (Bettruhe in h:12, Rückenlage)'
  },
  {
    id: 'study_status',
    label: 'STUDY_STATUS',
    color: '#00D2D3',
    description: 'Clinical study participation (Studienpatient: Nein)'
  },
  {
    id: 'datetime',
    label: 'DATETIME',
    color: '#576574',
    description: 'Timestamps and report dates (02.12.2024 12:42)'
  }
];

export const MEDICAL_ANNOTATION_SAMPLES: AnnotationSample[] = [
  {
    text: 'Dr. Piechowiak',
    entity: 'person',
    start: 0,
    end: 15
  },
  {
    text: 'TICI 2c',
    entity: 'medical_score',
    start: 25,
    end: 32
  },
  {
    text: '0.9mg/kg rtPA',
    entity: 'dosage',
    start: 40,
    end: 53
  },
  {
    text: 'Solitaire',
    entity: 'device',
    start: 60,
    end: 69
  },
  {
    text: 'A. femoralis communis rechts',
    entity: 'vessel',
    start: 75,
    end: 105
  },
  {
    text: 'Tandemverschluss ICA und M1 links',
    entity: 'diagnosis',
    start: 110,
    end: 145
  },
  {
    text: 'Intubationsnarkose',
    entity: 'anesthesia',
    start: 150,
    end: 169
  },
  {
    text: '02.12.2024 12:42',
    entity: 'datetime',
    start: 175,
    end: 191
  },
  {
    text: 'Bettruhe in h:12',
    entity: 'bedrest',
    start: 200,
    end: 216
  }
];
