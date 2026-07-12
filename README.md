# Infra-DSC

> AI-powered road damage detection and mapping — upload a photo, get cracks and potholes detected and segmented automatically, see it all on a map.
> 

https://github.com/user-attachments/assets/6f9c2a20-f85c-44ae-8aae-fcfa993d56f5

## Overview

Infra-DSC analyzes road photos to detect and segment surface damage (cracks,
potholes, lane-marking wear) using two custom-trained YOLO models — one for
object detection, one for segmentation. Each upload is geotagged via EXIF GPS
data and plotted on an interactive map, with a computed **crack ratio**
quantifying the damaged surface area.

Built as a full-stack system: a Next.js frontend for upload/visualization and
a FastAPI backend serving inference results from a relational database.

## Features

- **Dual-model inference** — bounding-box detection + pixel-level segmentation
  on every upload, run through Ultralytics YOLO (https://github.com/ultralytics/ultralytics).
- **Crack ratio scoring** — segmentation masks are used to compute the
  percentage of damaged surface area per photo.
- **Geotagged results** — EXIF GPS coordinates are extracted client-side and
  rendered on a clustered Leaflet map.
- **Result caching** — duplicate uploads are detected via image hashing and
  return cached results instead of re-running inference.
- **Client-side image compression** before upload, to keep payloads small.
- **Paginated photo history** with per-photo detail view (original image,
  thumbnail, detections, segmentation overlays).

## Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | Next.js, React, TypeScript, Tailwind CSS, Leaflet / react-leaflet |
| Backend     | FastAPI, Pydantic, SQLAlchemy, Alembic |
| ML          | Ultralytics YOLO (detection + segmentation), PyTorch, OpenCV |
| Database    | MySQL <!-- TODO: update to PostgreSQL once migrated --> |
| Tooling     | Bun (frontend), pip (backend) |

## Getting Started

### Prerequisites

- Python 3.12+
- Bun (or Node.js) for the frontend
- MySQL <!-- TODO: PostgreSQL --> instance

### Backend
```terminal
cd backend
pip install -r requirements.txt
cp .env.example .env.local   # set DATABASE_URL, etc.   <!-- TODO: create .env.example -->
alembic upgrade head
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

cd frontend
bun install
bun run dev

Then visit http://localhost:3000

## API Overview

| Method | Endpoint            | Description                                  |
|--------|----------------------|-----------------------------------------------|
| POST   | /api/predict/         | Upload an image, run detection + segmentation |
| GET    | /api/photos/          | Paginated list of analyzed photos             |
| GET    | /api/photos/{id}/     | Full detection/segmentation detail for a photo|
| GET    | /health               | Health check                                  |

Full interactive docs available at /docs (Swagger UI) once the backend is running.

## Project Structure
```text
Infra-DSC/
├── backend/
│   ├── app.py          # FastAPI app, routes
│   ├── yolo.py         # YOLO model wrapper (detection + segmentation)
│   ├── models.py        # SQLAlchemy models
│   ├── schema.py         # Pydantic request/response schemas
│   ├── utils.py           # thumbnail/mask helpers
│   └── alembic/            # database migrations
└── frontend/
    ├── app/                # Next.js pages
    ├── components/          # UI components
    ├── hooks/                # data-fetching + canvas-drawing hooks
    └── services/              # API client
```

## Roadmap

- [ ] Automated test suite + CI
- [ ] PostgreSQL migration
- [ ] Dockerized dev environment
- [ ] User accounts / authentication
- [ ] Points / gamification system

## Acknowledgments

- Ultralytics YOLO (https://github.com/ultralytics/ultralytics) for the detection/segmentation framework.
