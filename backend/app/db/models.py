from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Printer(Base):
    __tablename__ = "printers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    model: Mapped[str] = mapped_column(String(120), default="")
    ip_address: Mapped[str] = mapped_column(String(64), default="")
    status: Mapped[str] = mapped_column(String(32), default="idle")

    jobs: Mapped[list["PrintJob"]] = relationship(back_populates="printer")


class PrintJob(Base):
    __tablename__ = "print_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(32), default="created")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    printer_id: Mapped[int] = mapped_column(ForeignKey("printers.id"))
    printer: Mapped["Printer"] = relationship(back_populates="jobs")