FROM python:3.12.1

WORKDIR /code


RUN pip install --upgrade pip 

COPY ./src/. /code/

RUN pip install -r requirements.txt

EXPOSE 8000

ENTRYPOINT ["bash", "script.sh"]
# ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]