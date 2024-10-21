#!/bin/sh

startRed='\e[1;31m'
endRed='\e[0m'

case $1 in
  'run')
    poetry run python manage.py migrate && cd frontend && npm run lint -- --fix && npm run build && cd ..
    poetry run python manage.py collectstatic --noinput && poetry run python manage.py runserver
  ;;
  'install')
    poetry install && cd frontend && npm install && cd ..
    poetry export --without-hashes --format=requirements.txt > requirements.txt
  ;;
  'install-poetry')
    pipx install poetry
    pipx inject poetry poetry-plugin-export
    poetry config warnings.export false
  ;;
  *)
    echo -e "Please specify ${startRed}run${endRed}, ${startRed}install${endRed} or ${startRed}install-poetry${endRed}"
  ;;
esac