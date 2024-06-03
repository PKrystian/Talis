#!/bin/sh

startRed='\e[1;31m'
endRed='\e[0m'

case $1 in
  'run')
    poetry run manage.py migrate && cd frontend && npm run build && cd ..
    poetry run manage.py collectstatic --noinput && poetry run manage.py runserver
  ;;
  'install')
    poetry install && cd frontend && npm install && cd ..
  ;;
  *)
    echo -e "Please specify ${startRed}run${endRed} or ${startRed}install${endRed}"
  ;;
esac