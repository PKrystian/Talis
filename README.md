# Talis - Board Game Helper

An application to help select board games and organize them.

## Prerequisites

Before starting, ensure you have the following installed:

- [Python 3.11](https://www.python.org/downloads/) or higher
- [Node.js 18](https://nodejs.org/en/download/package-manager/current) or higher
- [npm 10](https://nodejs.org/en/download/package-manager/current) or higher
- [PostgreSQL 16](https://www.postgresql.org/download/)
- [pgAdmin](https://www.pgadmin.org/) (optional, for managing the database)
- [PyCharm](https://www.jetbrains.com/pycharm/download/) (optional, for development)

## Installation & Setup

### 1. Clone the repository

Ensure you have an SSH key added to your GitHub account. Then, clone the repository:

```bash
git clone git@github.com:PKrystian/Talis.git
cd Talis
```

### 2. Install dependencies

#### Install `pipx`

```bash
python -m pip install --user pipx
export PATH="$PATH:`python -m site --user-base`/Scripts"
```

#### Install `poetry`

```bash
chmod +x build.sh
./build.sh install-poetry
```

#### Install project dependencies

```bash
./build.sh install
```

### 3. Set up the database

#### Using PostgreSQL CLI:

```bash
psql
CREATE DATABASE db_dev;
CREATE USER postgres WITH PASSWORD 'local';
```

#### Using pgAdmin:

1. Open pgAdmin and log in.
2. Navigate to **Databases** -> **Create** -> **Database**.
3. Set the database name to `db_dev` and confirm.
4. Go to **Login Roles** -> **Create** -> **Login Role**.
5. Set the username to `postgres` and the password to `local`, then confirm.

### 4. Configure environment variables

Set up the required environment variables:

```bash
export DEBUG=True
export DEVELOPMENT_MODE=True
export DEVELOPMENT_PASSWORD="your_password"
export DEVELOPMENT_PORT="your_port"
```

Replace `your_password` and `your_port` with your actual values. If the PostgreSQL password is `local`, you can skip setting `DEVELOPMENT_PASSWORD`.

### 5. Build and run the application

```bash
./build.sh run
```

After the process completes, the application will be accessible in the browser at the URL displayed in the terminal.

### 6. Create an admin account

To access the admin panel, create a superuser:

```bash
poetry run python manage.py createsuperuser
```

Follow the terminal instructions to set up the username, email, and password.

### 7. Access the application

- Open your browser and go to the URL displayed in the terminal.
- To access the admin panel, append `/admin` to the URL and log in with your superuser credentials or log in on the main page and click Admin Panel tab on the user dropdown menu in the top right corner.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

