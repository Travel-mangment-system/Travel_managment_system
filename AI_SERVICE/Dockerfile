# Use a lightweight Python base image
FROM python:3.10-slim
WORKDIR /app

# Copy the requirements file first to cache the pip install step
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the container
EXPOSE 5000

# Run the Python application
CMD ["python", "main.py"]