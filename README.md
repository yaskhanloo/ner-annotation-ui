# NER Annotation Tool

A web application for annotating thrombectomy-specific medical entities in German documents. Upload PDFs, select text, assign entity labels, and export annotations as JSON.

## Quick Start

### Docker (Recommended)
```bash
# One-click deployment
./deploy.sh

# Or manually
docker-compose up -d
```
Access at: http://localhost:3001

### Local Development
```bash
# Setup environment variables
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Install dependencies
npm run install:all
pip install -r backend/requirements.txt

# Start servers
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## How to Use

1. **Upload PDF** - Drag and drop a medical document
2. **Select Text** - Click and drag to select text
3. **Assign Entity** - Choose from 18 thrombectomy-specific entity types
4. **Export JSON** - Download your annotations

## Thrombectomy Entity Types

| Entity | Description | Example |
|--------|-------------|---------|
| ANAESTHESIA | Type of anesthesia or sedation | Intubationsnarkose, Propofol |
| ASPIRATION_CATHETER | Aspiration catheters and usage | RED 68, RED 72 |
| COMPLICATIONS | Complications during intervention | Dissektion, Blutung |
| INTERVENTION_TIMING | Timings of intervention steps | Puncture-to-reperfusion times |
| EXTRACRANIAL_PTA | Extracranial percutaneous transluminal angioplasty | - |
| INTRACRANIAL_PTA | Intracranial percutaneous transluminal angioplasty | - |
| GUIDE_CATHETER | Guide catheters | Cerebase, Emboguard |
| MICROCATHETER | Microcatheters | Trevo Trak 21 |
| RECANALIZATION_ATTEMPTS | Number of attempts/manoeuvres | - |
| ANTIPLATELET_THERAPY | Antiplatelet treatments | Aspirin, Integrilin |
| THROMBOLYSIS | Thrombolysis administration | rtPA, Tenekteplase |
| SPASMOLYTIC_MEDICATION | Spasmolytic medication usage | - |
| OCCLUSION_SITE | Site of vessel occlusion | ICA, M1, Tandemverschluss |
| CERVICAL_STENOSES | Cervical stenoses findings | - |
| STENT_RETRIEVER | Stent retrievers | Solitaire 6x40mm |
| TICI_SCORE | TICI reperfusion score | TICI 2c, TICI 3 |
| TECHNIQUE_FIRST_MANEUVER | Technique used in first maneuver | Stent-retriever, Pinning |
| VESSEL_VISUALIZATION | Vessel visualization during procedure | - |

## Project Structure

```
ner-annotation-ui/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API communication services
│   │   ├── utils/             # Utility functions
│   │   ├── constants/         # Application constants
│   │   ├── data/              # Medical entities and sample data
│   │   ├── App.jsx            # Main application component
│   │   └── main.jsx           # Application entry point
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── .env.example           # Frontend environment template
├── backend/                    # Express.js API + Python PDF parser
│   ├── config/                # Configuration management
│   ├── routes/                # API route handlers
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions and logging
│   ├── uploads/               # PDF upload directory
│   ├── server.js              # Express server entry point
│   ├── pdf_parser.py          # Python PDF text extraction
│   ├── requirements.txt       # Python dependencies
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Backend environment template
├── Dockerfile                 # Multi-stage container build
├── docker-compose.yml         # Container orchestration
├── deploy.sh                  # One-click deployment script
├── package.json               # Root package with dev scripts
└── .env.example               # Root environment template
```

## Commands

```bash
# Docker
./deploy.sh            # Deploy with Docker
docker-compose logs -f # View logs
docker-compose down    # Stop

# Development
npm run dev            # Start both servers
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
```

## API Endpoints

- `GET /api/health` - Health check and server status
- `POST /api/upload-pdf` - Upload PDF and extract text
- `GET /api/annotations/:documentId` - Get saved annotations
- `POST /api/annotations/:documentId` - Save annotations
- `GET /api/entities` - Get available entity types
- `POST /api/entities` - Create custom entity type
- `GET /api/export/:documentId/:format` - Export annotations

## Troubleshooting

- **Port 3001 in use**: Stop other services or change port
- **PDF parsing fails**: Check Python dependencies
- **Docker issues**: Run `docker-compose logs`