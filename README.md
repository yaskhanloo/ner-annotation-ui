# Medical NER Annotation UI

A production-ready hybrid web application for Named Entity Recognition (NER) annotation of German medical documents, specifically optimized for stroke intervention reports. Features a guided 3-step workflow with Material-UI stepper interface and AI-powered pre-annotation.

## ✨ New Features (v2.0)

- **🤖 AI Pre-annotation**: Intelligent suggestions for medical entities using pattern matching
- **🛡️ Error Boundaries**: Robust error handling with graceful fallbacks  
- **⚡ Performance Optimizations**: Memoized components and efficient re-renders
- **🎨 Enhanced UI**: Improved Material-UI components with better UX
- **📊 Confidence Scoring**: AI suggestions with confidence levels
- **🔧 Better Backend**: Improved error handling, validation, and timeouts

## Technical Architecture

**Hybrid Stack**
- Frontend: React 19.1.0 + Vite 7.0.4 + Material-UI 7.2.0 + TypeScript
- Backend API: Node.js + Express 5.1.0 + TypeScript + Multer
- PDF Processing: Python 3.x + pdfplumber 0.11.7
- Communication: Axios HTTP client + REST API

**Ports & Services**
- Frontend: http://localhost:3000 (Vite dev server)
- Backend API: http://localhost:3001 (Express server)
- PDF Parser: Python subprocess integration

## Project Structure

```
ner-annotation-ui/
├── frontend/                           # React TypeScript application
│   ├── src/
│   │   ├── App.tsx                     # Main application with Material-UI theme
│   │   ├── components/                 # React components (TypeScript)
│   │   ├── data/                       # Medical entities and sample data
│   │   └── services/                   # API client services
│   ├── tsconfig.json                   # TypeScript configuration
│   └── package.json                    # Frontend dependencies
├── backend/                            # Express API server
│   ├── server.ts                       # Main Express app (TypeScript)
│   ├── pdf_parser.py                   # Enhanced PDF text extraction
│   ├── requirements.txt                # Python dependencies
│   └── uploads/                        # Temporary PDF storage
└── package.json                        # Root scripts and dependencies
```

## Medical Entity Types (15 Categories)

Optimized for German stroke intervention reports:

1. **PERSON** - Patient/physician names
2. **PROCEDURE** - Medical interventions
3. **DEVICE** - Medical instruments
4. **VESSEL** - Anatomical structures
5. **DIAGNOSIS** - Conditions/findings
6. **MEDICAL_SCORE** - Scoring systems
7. **SYMPTOM** - Clinical signs
8. **ANESTHESIA** - Anesthesia types
9. **MEDICATION** - Drugs/agents
10. **DOSAGE** - Drug amounts
11. **TIME** - Temporal information
12. **MEASUREMENT** - Vital signs
13. **BEDREST** - Post-procedural care
14. **STUDY_STATUS** - Clinical study info
15. **DATETIME** - Timestamps

## API Endpoints

**Core Endpoints**
- `GET /api/health` - Backend health check
- `POST /api/upload-pdf` - Upload & parse PDF files
- `GET /api/annotations/:documentId` - Retrieve saved annotations
- `POST /api/annotations/:documentId` - Save annotation data
- `GET /api/entities` - Get entity type definitions
- `POST /api/entities` - Create custom entity types
- `GET /api/export/:documentId/:format` - Export in various formats

## Quick Start

### 🐳 Docker (Recommended)
```bash
# Start with Docker Compose
docker-compose up -d

# Access at http://localhost:3001
# View logs: docker-compose logs -f
```

### 💻 Local Development
**Prerequisites**
```bash
node -v        # v16+ required
npm -v         # v8+ required  
python3 -v     # v3.8+ required
```

**Installation & Setup**
```bash
# 1. Clone and install all dependencies
npm run install:all

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Start development servers
npm run dev
```

**Alternative: Manual Start**
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm run dev
```

## Export Formats

**1. Enhanced JSON** - Complete annotation data with metadata
**2. spaCy Training Format** - Ready for spaCy model training
**3. CoNLL-2003 Format** - Standard NER training format
**4. Hugging Face Format** - Compatible with transformers library

## 3-Step Guided Workflow

**Step 1: Upload Document** - PDF upload with drag & drop interface
**Step 2: Annotate Entities** - Smart suggestions with 15 medical entity types
**Step 3: Export Results** - Multi-format export with completion summary

## Development Commands

**Root Scripts**
```bash
npm run dev              # Start both frontend & backend
npm run install:all      # Install all dependencies
npm run start           # Production mode
npm run build           # Build frontend
```

**Frontend Scripts**
```bash
npm run dev             # Vite dev server (port 3000)
npm run build           # Production build
npm run lint            # ESLint code checking
```

**Backend Scripts**
```bash
npm start               # Production server (port 3001)
npm run dev             # Development with nodemon
```

## Configuration

**Environment Variables**
```bash
# backend/.env (optional)
PORT=3001                           # Backend port
NODE_ENV=development               # Environment mode
```

## Known Issues & Solutions

**Common Problems**
1. "pdfplumber not found": Install with `pip install pdfplumber`
2. Port conflicts: Check if ports 3000/3001 are available
3. CORS errors: Ensure backend is running on port 3001

**Debugging**
```bash
# Check backend health
curl http://localhost:3001/api/health

# Verify Python dependencies
python3 -c "import pdfplumber; print('OK')"
```

## Testing

**Automated Testing**
```bash
# Start backend first
npm run dev:backend

# In another terminal, run tests
node test-app.js
```

**Manual Testing Checklist**
- [ ] Backend health check responds
- [ ] PDF upload and parsing works
- [ ] Text selection and annotation works
- [ ] AI pre-annotation generates suggestions
- [ ] Entity labeling with keyboard shortcuts
- [ ] Export functionality works
- [ ] Error handling displays properly

**Test with Sample Data**
The app includes sample medical text for testing. Use the "Use Sample Text" button in Step 1.

## Performance Optimizations

- **React.memo()** on expensive components
- **useCallback()** for event handlers
- **useMemo()** for computed values
- **Debounced text selection** (300ms)
- **Chunked processing** for large documents
- **Lazy loading** for export formats

## 🐳 Docker Deployment

### Quick Commands
```bash
# Development
npm run compose:up      # Start with docker-compose
npm run compose:down    # Stop containers
npm run compose:logs    # View logs

# Production
npm run docker:build   # Build Docker image
npm run docker:run     # Run container
npm run docker:stop    # Stop and remove container
```

### Production Deployment
See [DOCKER_README.md](./DOCKER_README.md) for detailed Docker deployment instructions.

## Support

For technical issues, verify:
1. **Docker**: `docker-compose logs` for container issues
2. **Local**: Backend server running on port 3001
3. **Local**: Frontend accessible on port 3000  
4. Python dependencies installed
5. PDF files are valid and readable