from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.schemas import JobCreate, JobOut
from app.db.models import PrintJob, Printer

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobOut, status_code=201)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    printer = db.get(Printer, payload.printer_id)
    if not printer:
        raise HTTPException(status_code=400, detail="printer_id does not exist")

    job = PrintJob(title=payload.title, printer_id=payload.printer_id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(PrintJob).order_by(PrintJob.id.desc()).all()