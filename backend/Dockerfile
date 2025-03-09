FROM python:3.10.7-slim-buster

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Inštalácia curl spolu s existujúcimi balíkmi
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    python3-opencv \
    curl

# Vyčistenie apt cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

ENV TESSDATA_PREFIX /usr/share/tesseract-ocr/4.00/tessdata

RUN ln -s $TESSDATA_PREFIX /usr/local/share/tessdata

RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY ./tessdata/slk.traineddata $TESSDATA_PREFIX

COPY . /app

# CMD je prepísané v docker-compose.yml na /app/entrypoint.sh, takže toto môžeme ponechať
CMD ["python", "run.py"]