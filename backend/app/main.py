from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.utils.exceptions import AppException
from app.api.routes import health, auth, products, cart, orders, farmers, warehouse, bulk_orders, admin, ml
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="KrishiGo API Phase 1",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
    return response

# Global Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail,
    )

# Include Routers
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(cart.router, prefix=f"{settings.API_V1_STR}/cart", tags=["cart"])
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(farmers.router, prefix=f"{settings.API_V1_STR}/farmers", tags=["farmers"])
app.include_router(warehouse.router, prefix=f"{settings.API_V1_STR}/warehouse", tags=["warehouse"])
app.include_router(bulk_orders.router, prefix=f"{settings.API_V1_STR}/bulk-orders", tags=["bulk-orders"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(ml.router, prefix=f"{settings.API_V1_STR}/ml", tags=["machine-learning"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up KrishiGo API...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down KrishiGo API...")
