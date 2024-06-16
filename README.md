# Talis

Application to help select board games and organize them.

## Prerequisites

- [Python 3.10](https://www.python.org/downloads/) or higher
- [Node.js $ npm](https://nodejs.org/en/download/package-manager/current)
- [PostgresSQL](https://www.postgresql.org/download/)
- [PyCharm Professional or Community](https://www.jetbrains.com/pycharm/download/) (optional)

## Setup

1. **[Add ssh key](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) to GitHub account if you haven't already**
2. **Clone the repository**
```bash
git clone git@github.com:PKrystian/Talis.git
cd Talis
```

3. **Install pipx**
```bash
python -m pip install --user pipx
export PATH="$PATH:`python -m site --user-base`/Scripts"
```

4. **Install poetry**
```bash
chmod +x build.sh
./build.sh install-poetry
```

5. **Install dependencies**
```bash
./build.sh install
```

6. **Create local postgres database**
    
```bash
psql
CREATE DATABASE db_dev;
CREATE USER postgres WITH PASSWORD 'local';
```
- If this doesn't work, try to create the database and user in [pgAdmin manually.](https://www.youtube.com/watch?v=IugEHi_5kMA)

7. **Set up environment variables**

```bash
export DEBUG=True
export DEVELOPMENT_MODE=True
export DEVELOPMENT_PASSWORD="your_password"
```
- If your password in pgAdmin is 'local' you can ignore the last command

8. **Build the project**
```bash
./build.sh run
```

9. **Create superuser**
```bash
poetry run python manage.py createsuperuser
```

- Follow the instructions in the terminal.

10. **Open the browser and go to link from the terminal and test the application**
11. **Add /admin to the link and log in with the superuser credentials to see the admin panel**

## License

This project is licensed under the MIT License - see the LICENSE.md file for details