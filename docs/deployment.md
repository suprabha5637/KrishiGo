# KrishiGo Deployment Guide

## Development

### Docker (Recommended)
```bash
cp .env.example .env
docker compose up
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Manual

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Production Architecture

```
Internet → CloudFront/ALB → Next.js (Vercel/ECS)
                          → FastAPI (ECS/Fargate)
                              ↓
                          PostgreSQL (RDS)
                          Redis (ElastiCache)
                          S3 (File Storage)
                          CloudWatch (Monitoring)
```

### AWS Services
- **Compute**: ECS/Fargate for backend containers
- **Frontend**: Vercel or S3+CloudFront
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Cache**: ElastiCache Redis
- **Storage**: S3 for file uploads
- **CDN**: CloudFront
- **Monitoring**: CloudWatch + structured logging
- **CI/CD**: GitHub Actions → ECR → ECS

### Environment Variables
Set via AWS Systems Manager Parameter Store or Secrets Manager.

### Database Migrations
Run `alembic upgrade head` as part of deployment pipeline.
