FROM python:3.9

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN prisma generate --schema=prisma/schema.prisma 
RUN prisma db push

CMD ["python3", "main.py"]
