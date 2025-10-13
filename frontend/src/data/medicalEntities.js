// Thrombectomy-specific medical entities

export const MEDICAL_ENTITIES = [
  { id: 'anaesthesia', label: 'ANAESTHESIA', color: '#A29BFE', description: 'Type of anesthesia or sedation (Intubationsnarkose, Propofol, Midazolam)' },
  { id: 'aspiration_catheter', label: 'ASPIRATION_CATHETER', color: '#48DBFB', description: 'Aspiration catheters and usage (RED 68, RED 72, Absaugung)' },
  { id: 'complications', label: 'COMPLICATIONS', color: '#FF6B6B', description: 'Complications during intervention (Dissektion, Blutung, iatrogene Probleme)' },
  { id: 'intervention_timing', label: 'INTERVENTION_TIMING', color: '#54A0FF', description: 'Timings of intervention steps (Puncture-to-reperfusion times)' },
  { id: 'extracranial_pta', label: 'EXTRACRANIAL_PTA', color: '#FECA57', description: 'Extracranial percutaneous transluminal angioplasty' },
  { id: 'intracranial_pta', label: 'INTRACRANIAL_PTA', color: '#FDCB6E', description: 'Intracranial percutaneous transluminal angioplasty' },
  { id: 'guide_catheter', label: 'GUIDE_CATHETER', color: '#4ECDC4', description: 'Guide catheters (Cerebase, Emboguard, Ballon-Guider)' },
  { id: 'microcatheter', label: 'MICROCATHETER', color: '#45B7D1', description: 'Microcatheters (Trevo Trak 21, Microcatheter)' },
  { id: 'recanalization_attempts', label: 'RECANALIZATION_ATTEMPTS', color: '#5F27CD', description: 'Number of attempts/manoeuvres' },
  { id: 'antiplatelet_therapy', label: 'ANTIPLATELET_THERAPY', color: '#00D2D3', description: 'Antiplatelet treatments (Aspirin, Integrilin, IV aspirin)' },
  { id: 'thrombolysis', label: 'THROMBOLYSIS', color: '#96CEB4', description: 'Thrombolysis administration (IA-thrombolyse, rtPA, Tenekteplase)' },
  { id: 'spasmolytic_medication', label: 'SPASMOLYTIC_MEDICATION', color: '#FD79A8', description: 'Spasmolytic medication usage' },
  { id: 'occlusion_site', label: 'OCCLUSION_SITE', color: '#B53471', description: 'Site of vessel occlusion (ICA, M1, Tandemverschluss)' },
  { id: 'cervical_stenoses', label: 'CERVICAL_STENOSES', color: '#FDCB6E', description: 'Cervical stenoses findings' },
  { id: 'stent_retriever', label: 'STENT_RETRIEVER', color: '#FF9FF3', description: 'Stent retrievers (Solitaire, 6x40mm, 4x20mm)' },
  { id: 'tici_score', label: 'TICI_SCORE', color: '#96CEB4', description: 'TICI reperfusion score (TICI 2c, TICI 3, 100%)' },
  { id: 'technique_first_maneuver', label: 'TECHNIQUE_FIRST_MANEUVER', color: '#576574', description: 'Technique used in the first maneuver (Stent-retriever, Pinning)' },
  { id: 'vessel_visualization', label: 'VESSEL_VISUALIZATION', color: '#00D2D3', description: 'Vessel visualization during procedure' }
];

// Example annotation samples (to adapt with real report excerpts)
export const MEDICAL_ANNOTATION_SAMPLES = [
  { text: 'Intubationsnarkose', entity: 'anaesthesia', start: 0, end: 19 },
  { text: 'RED 68', entity: 'aspiration_catheter', start: 25, end: 31 },
  { text: 'Dissektion', entity: 'complications', start: 40, end: 50 },
  { text: 'TICI 2c', entity: 'tici_score', start: 55, end: 62 },
  { text: 'ICA Verschluss', entity: 'occlusion_site', start: 70, end: 85 }
];