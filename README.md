# Medical NER Annotation UI

A production-ready hybrid web application for Named Entity Recognition (NER) annotation of German medical documents, specifically optimized for stroke intervention reports. Features a guided 3-step workflow with Material-UI stepper interface.

## Technical Architecture

### **Hybrid Stack**
- **Frontend**: React 19.1.0 + Vite 7.0.4 + Material-UI 7.2.0 + Styled Components
- **Backend API**: Node.js + Express 5.1.0 + Multer (file upload)
- **PDF Processing**: Python 3.x + pdfplumber 0.11.7
- **Communication**: Axios HTTP client + REST API
- **UI Framework**: Material-UI with custom medical theme

### **Ports & Services**
- Frontend: `http://localhost:3000` (Vite dev server)
- Backend API: `http://localhost:3001` (Express server)
- PDF Parser: Python subprocess integration

## Project Structure

```
ner-annotation-ui/
├── README.md                           # This file
├── package.json                        # Root scripts (install:all, dev, start)
├── frontend/                           # React application
│   ├── src/
│   │   ├── App.jsx                     # Main application with Material-UI theme
│   │   ├── components/
│   │   │   ├── StepperWorkflow.jsx     # 3-step guided workflow with Material-UI
│   │   │   ├── PdfUploader.jsx         # PDF upload with drag&drop
│   │   │   ├── TextDisplay.jsx         # Text visualization with annotations
│   │   │   ├── EntityLabeler.jsx       # Entity selection buttons
│   │   │   ├── MedicalAnnotationHelper.jsx  # Smart suggestions & stats
│   │   │   └── ExportPanel.jsx         # Multi-format export (JSON/spaCy/CoNLL/HF)
│   │   ├── data/
│   │   │   ├── medicalEntities.js      # 15 medical entity types for German docs
│   │   │   └── sampleData.js           # Demo data
│   │   └── services/
│   │       └── api.js                  # Axios HTTP client for backend
│   └── package.json                    # React deps: axios, @mui/material, styled-components
├── backend/                            # Express API server
│   ├── server.js                       # Main Express app with API endpoints
│   ├── pdf_parser.py                   # Enhanced PDF text extraction
│   ├── requirements.txt                # Python deps: pdfplumber
│   └── uploads/                        # Temporary PDF storage
└── node_modules/                       # Root dependencies (concurrently)
```

## Medical Entity Types (15 Categories)

**Optimized for German stroke intervention reports:**

1. **PERSON** - Patient/physician names (Dr. Piechowiak, Lucie Gauch)
2. **PROCEDURE** - Medical interventions (Thrombektomie, IA-Thrombolyse)
3. **DEVICE** - Medical instruments (Solitaire, Trevo Trak 21, Cerebase)
4. **VESSEL** - Anatomical structures (ICA links, A. subclavia, M1-Segment)
5. **DIAGNOSIS** - Conditions/findings (Tandemverschluss, Stenose, ICAD)
6. **MEDICAL_SCORE** - Scoring systems (TICI 2c, NIHSS 15, mRS 3)
7. **SYMPTOM** - Clinical signs (Hemiparese, Sprachstörung)
8. **ANESTHESIA** - Anesthesia types (Intubationsnarkose, Lokalanästhesie)
9. **MEDICATION** - Drugs/agents (rtPA, Heparin, Aspirin)
10. **DOSAGE** - Drug amounts (0.9mg/kg, 100ml)
11. **TIME** - Temporal information (12:42, 2 Stunden, 90 Minuten)
12. **MEASUREMENT** - Vital signs (180/90 mmHg, 37.5°C)
13. **BEDREST** - Post-procedural care (Bettruhe in h:12, Rückenlage)
14. **STUDY_STATUS** - Clinical study info (Studienpatient: Nein)
15. **DATETIME** - Timestamps (02.12.2024 12:42)

## API Endpoints

### **Core Endpoints**
- `GET /api/health` - Backend health check
- `POST /api/upload-pdf` - Upload & parse PDF files
- `GET /api/annotations/:documentId` - Retrieve saved annotations
- `POST /api/annotations/:documentId` - Save annotation data
- `GET /api/entities` - Get entity type definitions
- `POST /api/entities` - Create custom entity types
- `GET /api/export/:documentId/:format` - Export in various formats

### **File Upload Details**
- **Method**: `POST /api/upload-pdf`
- **Content-Type**: `multipart/form-data`
- **Field**: `pdf` (file)
- **Restrictions**: PDF files only
- **Response**: `{ text, filename, pages, word_count, extraction_method }`

## Quick Start

### **Prerequisites**
```bash
# Required software
node -v        # v16+ required
npm -v         # v8+ required  
python3 -v     # v3.8+ required
pip --version  # Latest pip
```

### **Installation & Setup**
```bash
# 1. Clone and install all dependencies
npm run install:all

# 2. Install Python dependencies
pip install -r backend/requirements.txt
# or: pip install pdfplumber

# 3. Material-UI dependencies (already included in package.json)
# @mui/material @emotion/react @emotion/styled @mui/icons-material

# 4. Start development servers (both simultaneously)
npm run dev
# This runs: concurrently "npm run dev:backend" "npm run dev:frontend"
```

### **Alternative: Manual Start**
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### **Production Build**
```bash
npm run build        # Builds frontend for production
npm run start        # Runs backend + frontend preview
```

## PDF Processing Pipeline

### **Enhanced Extraction (pdf_parser.py)**
1. **Primary Method**: Layout-preserving extraction with `x_tolerance=2, y_tolerance=2`
2. **Fallback #1**: Table-aware extraction for structured documents
3. **Fallback #2**: Character-level reconstruction for complex layouts
4. **Medical Preprocessing**: 
   - Fixes broken medical terms (A spirin → Aspirin)
   - Normalizes dosages (5 mg → 5mg)
   - Preserves medical scores (TICI 2c, mRS 3)
   - Fixes spaced abbreviations (T I C I → TICI)

### **Text Quality Assessment**
Based on your sample extraction:
- **Excellent**: Names, medical scores, procedures preserved
- **Good**: Page breaks, device specifications, anatomical terms
- **Robust**: Multi-language support (German medical terminology)

## Export Formats

### **1. Enhanced JSON** (`medical_ner_annotations_YYYY-MM-DD.json`)
```json
{
  "document_info": {
    "created_at": "2024-12-02T10:30:00Z",
    "total_annotations": 45,
    "annotation_tool": "Medical NER Annotation UI"
  },
  "text": "Full document text...",
  "annotations": [
    {
      "id": "1234567890-abc123",
      "start": 25, "end": 32,
      "text": "TICI 2c",
      "label": "medical_score",
      "entity_info": {
        "label": "MEDICAL_SCORE",
        "description": "Medical scoring systems",
        "color": "#96CEB4"
      }
    }
  ]
}
```

### **2. spaCy Training Format** (`spacy_medical_ner_YYYY-MM-DD.json`)
```json
{
  "version": 4,
  "meta": {
    "lang": "de",
    "name": "medical_ner_model",
    "description": "Medical NER annotations for German stroke documents"
  },
  "data": [{
    "text": "Document text...",
    "entities": [
      {"start": 25, "end": 32, "label": "MEDICAL_SCORE"}
    ]
  }]
}
```

### **3. CoNLL-2003 Format** (`medical_ner_YYYY-MM-DD.conll`)
```
Dr.             B-PERSON
Piechowiak      I-PERSON
führte          O
eine            O
Thrombektomie   B-PROCEDURE
durch           O
mit             O
TICI            B-MEDICAL_SCORE
2c              I-MEDICAL_SCORE
Reperfusion     O
```

### **4. Hugging Face Format** (`huggingface_medical_ner_YYYY-MM-DD.json`)
```json
{
  "data": [{
    "tokens": ["Dr.", "Piechowiak", "führte", "Thrombektomie"],
    "ner_tags": ["B-PERSON", "I-PERSON", "O", "B-PROCEDURE"],
    "id": 0
  }],
  "features": {
    "tokens": {"dtype": "string", "_type": "Sequence"},
    "ner_tags": {"dtype": "string", "_type": "Sequence"}
  },
  "metadata": {
    "language": "de",
    "domain": "medical",
    "annotation_tool": "Medical NER Annotation UI"
  }
}
```

## Smart Annotation Features

### **MedicalAnnotationHelper Component**
- **Contextual Suggestions**: AI-powered entity recommendations
- **Confidence Scoring**: Percentage match for selected text
- **Real-time Statistics**: Annotation progress tracking
- **Search Filtering**: Find specific medical terms quickly

### **3-Step Guided Workflow** 

#### **Step 1: Upload Document** 
- **PDF Upload**: Drag & drop interface with automatic text extraction
- **Manual Text Input**: Direct text entry with validation
- **Backend Status**: Real-time connection monitoring
- **Text Preview**: Character count and content preview
- **Validation**: Requires valid text input to proceed

#### **Step 2: Annotate Entities** 
- **Smart Suggestions**: AI-powered entity recommendations with confidence scores
- **Interactive Text**: Select text to see contextual entity suggestions
- **Visual Feedback**: Real-time annotation progress tracking
- **Entity Management**: 15 specialized medical entity types
- **Validation**: Requires at least one annotation to proceed

#### **Step 3: Export Results** 
- **Completion Summary**: Document and annotation statistics
- **Multi-format Export**: JSON, spaCy, CoNLL-2003, Hugging Face formats
- **Workflow Control**: Options to restart, edit, or begin new document
- **Professional Output**: Timestamped files with rich metadata

## Material-UI Stepper Implementation

### **StepperWorkflow Component**
```jsx
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
```

### **Key Features**
- **Horizontal Stepper**: Clear visual progress through 3 main steps
- **Step Validation**: Cannot proceed without completing current requirements
- **Material Icons**: Upload, Edit, Download icons for visual clarity
- **Custom Theme**: Medical-focused color scheme with professional styling
- **Responsive Design**: Optimized for desktop and tablet use
- **Error States**: Visual feedback for incomplete steps

### **Step Navigation Logic**
```javascript
// Step validation prevents advancing without requirements
const isStepValid = (step) => {
  switch (step) {
    case 0: return text && text.trim().length > 0;        // Upload
    case 1: return annotations.length > 0;                // Annotation  
    case 2: return annotations.length > 0;                // Export
  }
};
```

### **Material-UI Dependencies**
```json
{
  "@mui/material": "^7.2.0",
  "@emotion/react": "^11.14.0", 
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.2.0"
}
```

### **Theme Configuration**
- **Primary Color**: Material Blue (#1976d2) for medical professionalism
- **Secondary Color**: Medical Red (#dc004e) for alerts and validation
- **Background**: Light grey (#f5f5f5) for reduced eye strain
- **Typography**: System fonts for cross-platform consistency

## Development Commands

### **Root Scripts**
```bash
npm run dev              # Start both frontend & backend
npm run install:all      # Install all dependencies
npm run start           # Production mode
npm run build           # Build frontend only
```

### **Frontend Scripts**
```bash
cd frontend
npm run dev             # Vite dev server (port 3000)
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # ESLint code checking
```

### **Backend Scripts**
```bash
cd backend  
npm start               # Production server (port 3001)
npm run dev             # Development with nodemon
```

### **Python Scripts**
```bash
# Direct PDF processing
python3 backend/pdf_parser.py document.pdf output.json

# Test extraction
python3 -c "import pdfplumber; print('pdfplumber ready!')"
```

## Configuration

### **Environment Variables**
```bash
# backend/.env (optional)
PORT=3001                           # Backend port
NODE_ENV=development               # Environment mode
```

### **Frontend API Configuration**
```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';
```

## Performance & Scalability

### **Frontend Optimizations**
- **React 19**: Latest performance improvements
- **Vite**: Fast bundling & hot reload
- **Material-UI 7**: Modern component library with theming
- **Styled Components**: CSS-in-JS with theming
- **Stepper Workflow**: Guided 3-step annotation process
- **Axios**: HTTP client with interceptors

### **Backend Optimizations**
- **Express 5**: Modern async/await support
- **Multer**: Streaming file uploads
- **CORS**: Configurable cross-origin policies
- **Python Subprocess**: Isolated PDF processing

### **PDF Processing**
- **Multiple Extraction Methods**: Fallback chain for reliability
- **Medical Text Preprocessing**: Domain-specific optimizations
- **Memory Efficient**: Streaming processing for large files

## Known Issues & Solutions

### **Common Problems**
1. **"pdfplumber not found"**: Install with `pip install pdfplumber`
2. **Port conflicts**: AirTunes uses 5000, we use 3001
3. **Python path issues**: Use absolute path in server.js
4. **CORS errors**: Backend must be running on port 3001

### **Debugging**
```bash
# Check backend health
curl http://localhost:3001/api/health

# Verify Python dependencies
python3 -c "import pdfplumber; print('OK')"

# Check ports
lsof -i :3000,3001
```

## Next Steps & Roadmap

### **Phase 1: Core Features** 
- [x] PDF upload & text extraction
- [x] Medical entity types (15 categories)
- [x] Smart annotation suggestions
- [x] Multi-format export (JSON/spaCy/CoNLL/HF)
- [x] Material-UI stepper workflow (3 steps)
- [x] Step validation & navigation logic
- [x] Professional UI with guided experience

### **Phase 2: Advanced Features** 
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication & project management
- [ ] Batch PDF processing
- [ ] Inter-annotator agreement metrics
- [ ] Custom entity type creation UI

### **Phase 3: ML Integration** 
- [ ] Pre-annotation with existing models
- [ ] Active learning suggestions
- [ ] Model training pipeline integration
- [ ] Annotation quality assessment

---

## Support & Feedback

For technical issues or feature requests, check the console logs and verify:
1. Backend server running on port 3001
2. Frontend accessible on port 3000  
3. Python dependencies installed
4. PDF files are valid and readable