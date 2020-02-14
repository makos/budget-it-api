#!/usr/bin/bash

if [ "$1" == "loud" ]
then
    NODE_ENV=test npx sequelize db:seed:undo:all
    NODE_ENV=test npx sequelize db:migrate:undo:all
else
    NODE_ENV=test npx sequelize db:seed:undo:all &> /dev/null
    NODE_ENV=test npx sequelize db:migrate:undo:all &> /dev/null
fi
