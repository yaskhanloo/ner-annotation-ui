# NER Annotation Tool

A simple web application for annotating medical entities in German documents. Upload PDFs, select text, assign entity labels, and export as JSON.

## Quick Start

### 🐳 Docker (Recommended)
```bash
# One-click deployment
./deploy.sh

# Or manually
docker-compose up -d
```
Access at: http://localhost:3001

### 💻 Local Development
```bash
# Install dependencies
npm run install:all
pip install -r backend/requirements.txt

# Start servers
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## How to Use

1. **Upload PDF** - Drag & drop a medical document
2. **Select Text** - Click and drag to select text
3. **Assign Entity** - Choose from 15 medical entity types
4. **Export JSON** - Download your annotations

## Medical Entity Types

| Entity | Example |
|--------|---------|
| PERSON | Dr. Smith |
| PROCEDURE | Thrombektomie |
| DEVICE | Solitaire Stent |
| VESSEL | ICA links |
| DIAGNOSIS | Stenose |
| MEDICAL_SCORE | TICI 2c |
| MEDICATION | rtPA |
| DOSAGE | 0.9mg/kg |
| TIME | 90 Minuten |
| DATETIME | 02.12.2024 12:42 |

## Project Structure

```
ner-annotation-ui/
├── frontend/          # React app
├── backend/           # Express API + Python PDF parser
├── Dockerfile         # Container build
├── docker-compose.yml # Container orchestration
└── deploy.sh          # One-click deployment
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

- `GET /api/health` - Health check
- `POST /api/upload-pdf` - Upload PDF
- `POST /api/annotations/:id` - Save annotations
- `GET /api/export/:id` - Export JSON

## Troubleshooting

- **Port 3001 in use**: Stop other services or change port
- **PDF parsing fails**: Check Python dependencies
- **Docker issues**: Run `docker-compose logs`