from contextlib import asynccontextmanager
<<<<<<< HEAD
from fastapi import FastAPI, Depends
=======
from fastapi import FastAPI
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import register_exception_handlers
from app.api.routes import health
from app.db.session import check_db_connection

# Initialize centralized logging with sensitive data sanitization
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Performs readiness check on startup without automatically altering schema.
    Database migrations are kept separate and managed via Alembic.
    """
    logger.info(
        "Starting %s [version: %s, env: %s]",
        settings.PROJECT_NAME,
        settings.VERSION,
        settings.ENVIRONMENT,
    )
    logger.info("Configured database: %s", settings.sanitized_database_url)

    # Perform startup connection verification
    is_ready, _ = check_db_connection()
    if is_ready:
        logger.info("Authoritative database connectivity verified.")
        try:
            import app.models  # noqa: F401
            from app.db.base import Base
            from app.db.session import engine
            Base.metadata.create_all(bind=engine)
            logger.info("Authoritative database schema initialized.")
        except Exception as e:
            logger.warning("Database schema auto-init notice: %s", e)
    else:
        logger.warning(
            "Database connectivity check failed during startup. "
            "Service will start, but readiness checks will fail until DB is online."
        )


    yield

    logger.info("Shutting down %s.", settings.PROJECT_NAME)


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
<<<<<<< HEAD
        "HETVAYA: AI-powered distribution intelligence, inventory optimization, and product assistant. "
=======
        "FlowGrid: AI-powered distribution intelligence and inventory optimization system. "
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        "Enforces the backend as the single authority for inventory allocation and commitment."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register secure centralized exception handlers
register_exception_handlers(app)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
from app.api.v1.router import api_router
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router, include_in_schema=False)  # Direct route aliases without /api/v1 prefix


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} Backend",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "authoritative_rule": "Backend is the single authority for plan commitment",
    }
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
