"""init tables

Revision ID: 0001_init_tables
Revises:
Create Date: 2026-03-04

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0001_init_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "printers",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("model", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("ip_address", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="idle"),
    )

    op.create_table(
        "print_jobs",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="created"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("printer_id", sa.Integer(), sa.ForeignKey("printers.id"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("print_jobs")
    op.drop_table("printers")
