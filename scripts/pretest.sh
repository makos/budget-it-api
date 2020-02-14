#!/usr/bin/bash

if [ "$1" == "loud" ]
then
    NODE_ENV=test npx sequelize db:migrate
    NODE_ENV=test npx sequelize db:seed:all
else
    NODE_ENV=test npx sequelize db:migrate &> /dev/null
    NODE_ENV=test npx sequelize db:seed:all &> /dev/null
fi
