from fastapi import FastAPI

from app.api.routers.health import router as health_router
from app.api.routers.printers import router as printers_router
from app.api.routers.jobs import router as jobs_router

app = FastAPI(title="PrinterHub MVP")

app.include_router(health_router)
app.include_router(printers_router)
app.include_router(jobs_router)