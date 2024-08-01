# Instructions

Docker and docker-compose must be installed. Docker must be running.

Run `docker-compose up --build` to start the container. The tools will be available at `http://localhost:8080`.

## Alternative instructions - no Docker

Run the frontend:

```
cd frontend
npm install
npm start
```

Run the backend:

```
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```
