# NER Annotation Tool - Docker Deployment

A containerized medical Named Entity Recognition (NER) annotation tool for German medical documents. Upload PDFs, annotate medical entities, and export results as JSON.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker (20.10+)
- Docker Compose (2.0+)

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd ner-annotation-ui

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 2: Docker Build & Run
```bash
# Build the image
docker build -t ner-annotation-tool .

# Run the container
docker run -d \
  --name ner-annotation \
  -p 3001:3001 \
  --restart unless-stopped \
  ner-annotation-tool

# View logs
docker logs -f ner-annotation
```

## 🌐 Access the Application

Once running, access the application at:
- **Application**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📋 Features

- **📄 PDF Upload**: Drag & drop PDF files for text extraction
- **🏷️ Entity Annotation**: 15 predefined medical entity types
- **💾 JSON Export**: Download structured annotation results
- **🎯 3-Step Workflow**: Upload → Annotate → Export
- **🔍 Duplicate Text Support**: Annotate multiple instances of the same text
- **⚡ Fast Processing**: Optimized for medical documents

## 🏥 Medical Entity Types

| Entity | Description | Example |
|--------|-------------|---------|
| PERSON | Patient/physician names | Dr. Piechowiak |
| PROCEDURE | Medical interventions | Thrombektomie |
| DEVICE | Medical instruments | Solitaire Stent |
| VESSEL | Arteries and veins | ICA links |
| DIAGNOSIS | Conditions/findings | Tandemverschluss |
| MEDICAL_SCORE | Scoring systems | TICI 2c |
| SYMPTOM | Clinical signs | Hemiparese |
| ANESTHESIA | Anesthesia types | Intubationsnarkose |
| MEDICATION | Drugs/agents | rtPA |
| DOSAGE | Drug amounts | 0.9mg/kg |
| TIME | Times/durations | 90 Minuten |
| MEASUREMENT | Vital signs | 180/90 mmHg |
| BEDREST | Post-procedural care | Bettruhe |
| STUDY_STATUS | Clinical study info | Studienpatient: Nein |
| DATETIME | Timestamps | 02.12.2024 12:42 |

## 🔧 Configuration

### Environment Variables
```bash
# Production settings
NODE_ENV=production
PORT=3001

# Optional: Custom upload limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Volume Mounts (Optional)
```yaml
# In docker-compose.yml
volumes:
  - ./uploads:/app/backend/uploads  # Persist uploaded files
  - ./data:/app/data               # Persist annotation data
```

## 📊 Docker Image Details

### Multi-stage Build
- **Stage 1**: Builds React frontend with Vite
- **Stage 2**: Sets up Node.js backend with Python support
- **Final Image**: ~200MB Alpine-based container

### Included Components
- ✅ **Node.js 18** - Backend server
- ✅ **Python 3** - PDF processing with pdfplumber
- ✅ **React Frontend** - Built and served statically
- ✅ **Health Checks** - Container health monitoring

## 🛠️ Development

### Local Development (without Docker)
```bash
# Install dependencies
npm run install:all
pip install -r backend/requirements.txt

# Start development servers
npm run dev
```

### Build for Production
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && NODE_ENV=production npm start
```

## 📈 Performance & Scaling

### Resource Requirements
- **Memory**: 512MB minimum, 1GB recommended
- **CPU**: 1 core minimum, 2 cores recommended
- **Storage**: 1GB for application, additional for uploads

### Scaling Options
```yaml
# docker-compose.yml - Multiple instances
services:
  ner-annotation:
    deploy:
      replicas: 3
    # ... rest of config
```

## 🔒 Security Considerations

### Production Deployment
- ✅ **File Upload Limits**: 10MB max file size
- ✅ **File Type Validation**: PDF files only
- ✅ **Process Timeouts**: 30-second PDF processing limit
- ✅ **Automatic Cleanup**: Temporary files removed after processing

### Recommended Security Headers
```nginx
# nginx.conf (if using reverse proxy)
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

## 🐛 Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs ner-annotation
   
   # Verify port availability
   netstat -tulpn | grep 3001
   ```

2. **PDF processing fails**
   ```bash
   # Check Python dependencies
   docker exec -it ner-annotation python3 -c "import pdfplumber; print('OK')"
   ```

3. **Frontend not loading**
   ```bash
   # Verify static files
   docker exec -it ner-annotation ls -la /app/backend/public
   ```

### Health Check
```bash
# Manual health check
curl http://localhost:3001/api/health

# Expected response
{"status":"ok","message":"Server is running"}
```

## 📦 Deployment Options

### Cloud Deployment
- **AWS ECS/Fargate**: Use the provided Dockerfile
- **Google Cloud Run**: Supports container deployment
- **Azure Container Instances**: Direct Docker deployment
- **DigitalOcean App Platform**: Git-based deployment

### Self-hosted
- **Docker Swarm**: Multi-node deployment
- **Kubernetes**: Use provided Docker image
- **Portainer**: Web-based Docker management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Verify all dependencies are installed
4. Check that port 3001 is available

---

**Ready to annotate medical documents! 🏥📝**