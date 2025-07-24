## Project Setup

```
npm create vite@latest . # skip setting a project name 
npm install
npm run dev

# Additional dependencies for NER annotation:
npm install styled-components uuid react-hotkeys-hook
npm install --save-dev @types/uuid

# Python backend - simple FastAPI
/usr/bin/python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install fastapi uvicorn python-multipart
```

src/
├── components/
│   ├── TextDisplay.jsx
│   ├── EntityLabeler.jsx
│   └── ExportPanel.jsx
├── data/
│   └── sampleText.txt
├── App.jsx
└── main.jsx

src/
├── components/
│   ├── TextAnnotator/
│   │   ├── TextDisplay.jsx
│   │   ├── EntityHighlight.jsx
│   │   ├── LabelSelector.jsx
│   │   └── AnnotationPanel.jsx
│   ├── EntityManager/
│   │   ├── EntityList.jsx
│   │   └── EntityEditor.jsx
│   └── Common/
│       ├── Header.jsx
│       └── Toolbar.jsx
├── hooks/
│   ├── useSelection.js
│   ├── useAnnotations.js
│   └── useKeyboard.js
├── types/
│   └── annotations.js
├── utils/
│   ├── textSelection.js
│   └── exportUtils.js
└── data/
    └── sampleData.js