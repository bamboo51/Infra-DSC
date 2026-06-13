"""
Self-notes:
    conftest.py is pytest's shared setup for tests.
    Any fixtures defined here are available to all tests.
"""

import os

os.environ.setdefault("DATABASE_URL", "sqlite://")

import base64
import io
from unittest.mock import patch

import app as app_module
import pytest
from database import Base, get_db
from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# One in-memory SQLite DB shared across the test's connections
engine = create_engine(
    "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
)
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# A minimal valid PNG
FAKE_MASK_URI = "data:image/png;base64," + base64.b64encode(b"fake-ong-bytes").decode()


class FakeMLModel:
    """
    Replaces yolo.MLModel
    """

    def detection(self, image, name=None):
        return [
            {
                "box_x1": 1,
                "box_y1": 2,
                "box_x2": 30,
                "box_y2": 40,
                "confidence": 0.9,
                "class_id": 0,
                "class_name": "crack",
            }
        ]

    def segmentation(self, image, name=None):
        return (
            [
                {
                    "mask_uri": FAKE_MASK_URI,
                    "class_id": 0,
                    "confidence": 0.9,
                    "class_name": "crack",
                }
            ],
            0.42,
        )


@pytest.fixture
def client(tmp_path, monkeypatch):
    # predict() writes to relative "mdeia/..." paths
    monkeypatch.chdir(tmp_path)
    for d in ("media/photos", "media/thumbnails", "media/masks"):
        os.makedirs(tmp_path / d)
    Base.metadata.create_all(engine)
    db = TestSession()
    app_module.app.dependency_overrides[get_db] = lambda: db

    with patch.object(app_module, "MLModel", FakeMLModel):
        yield TestClient(app_module.app)
    app_module.app.dependency_overrides.clear()
    db.close()
    Base.metadata.drop_all(engine)


@pytest.fixture
def image_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (64, 64), "gray").save(buf, format="JPEG")
    return buf.getvalue()
