from datetime import datetime
from pydantic import BaseModel


class PrinterCreate(BaseModel):
    name: str
    model: str = ""
    ip_address: str = ""
    status: str = "idle"


class PrinterOut(PrinterCreate):
    id: int

    class Config:
        from_attributes = True


class JobCreate(BaseModel):
    title: str
    printer_id: int


class JobOut(BaseModel):
    id: int
    title: str
    status: str
    created_at: datetime
    printer_id: int

    class Config:
        from_attributes = True