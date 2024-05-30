# Talis

Application to help select board games and organize them.

## Prerequisites

- [Python 3.8](https://www.python.org/downloads/) or higher
- [Node.js $ npm](https://nodejs.org/en/download/package-manager/current)
- [PostgresSQL](https://www.postgresql.org/download/)
- [PyCharm Professional](https://www.jetbrains.com/pycharm/download/) (optional)

## Setup

1. **[Add ssh key](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) to GitHub account if you haven't already**
2. **Clone the repository**
```bash
git clone git@github.com:PKrystian/Talis.git
cd Talis
```

3. **Create a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate # Linux, Mac
source venv/Scripts/activate # Windows
```

4. **Install dependencies**

- TODO: Add script which will install the dependencies automatically.

```bash
pip3 install -r requirements.txt
cd frontend && npm install && cd ..
```

- If you're on macOS replace requirements.txt with requirements-macos.txt.

5. **Create local postgres database**
    
```bash
psql
CREATE DATABASE db_dev;
CREATE USER postgres WITH PASSWORD 'local';
```
- If this doesn't work, try to create the database and user in [pgAdmin manually.](https://www.youtube.com/watch?v=IugEHi_5kMA)

6. **Set up environment variables**

```bash
export DEBUG=True
export DEVELOPMENT_MODE=True
```

7. **Build the project**

- TODO: Add script which will build the project automatically.

```bash
python3 manage.py migrate
cd frontend && npm run build && cd ..
python3 manage.py collectstatic --noinput
python3 manage.py runserver
```

8. **Create superuser**

```bash
python3 manage.py createsuperuser
```

- Follow the instructions in the terminal.

9. **Open the browser and go to link from the terminal and test the application**
10. **Add /admin to the link and log in with the superuser credentials to see the admin panel**

## License

This project is licensed under the MIT License - see the LICENSE.md file for details