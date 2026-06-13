FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY download_weights.py .
ARG HF_WEIGHTS_REPO
ENV HF_WEIGHTS_REPO=${HF_WEIGHTS_REPO}
RUN python download_weights.py

COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
