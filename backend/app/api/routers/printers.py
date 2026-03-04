from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.api.schemas import PrinterCreate, PrinterOut
from app.db.models import Printer

router = APIRouter(prefix="/printers", tags=["printers"])


@router.post("", response_model=PrinterOut, status_code=201)
def create_printer(payload: PrinterCreate, db: Session = Depends(get_db)):
    printer = Printer(**payload.model_dump())
    db.add(printer)
    db.commit()
    db.refresh(printer)
    return printer


@router.get("", response_model=list[PrinterOut])
def list_printers(db: Session = Depends(get_db)):
    return db.query(Printer).order_by(Printer.id.desc()).all()


@router.get("/{printer_id}", response_model=PrinterOut)
def get_printer(printer_id: int, db: Session = Depends(get_db)):
    printer = db.get(Printer, printer_id)
    if not printer:
        raise HTTPException(status_code=404, detail="Printer not found")
    return printer