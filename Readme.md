# Public API for Budget It

Node.js + Express + Sequelize ORM + MariaDB

## Database tables
* `Records`
  * `RecordID`: integer, primary key
  * `Amount`: decimal (10 digits overall, 2 digits after the separator), not null
  * `Date`: date only (YYYY-MM-DD only), not null
  * `Type`: string, user specified type of record, default ''
  * `Comment`: string, user specified remarks, default ''
  * `RecordType`: enum, possible values `Income` or `Expense`, not null
  * `UserName`: string, foreign key, references Users.Name, not null
  * `createdAt`: date, full timestamp in ISO format, not null
  * `updatedAt`: date, full timestamp in ISO format, not null
    * `createdAt` and `updatedAt`  are automatically managed by Sequelize
* `Users`
  * `ID`: integer, not null, unique, auto increment
  * `Name`: string, not null, primary key
  * `Password`: string, not null
  * `createdAt`: date, full timestamp in ISO format, not null
  * `updatedAt`: date, full timestamp in ISO format, not null
    * `createdAt` and `updatedAt` are automatically managed by Sequelize

## API endpoints
* `/api/income` and `/api/expenses` methods
  * `GET` returns all existing Records for current user
  * `POST` a JSON body with `application/json` header to create a new Record
    entry, with provided keys:
    * `amount`: a number (integer or decimal, can be a string) representing the
      value of a transaction
    * `date` (optional): a date string in format `YYYY-MM-DD`, if not given
      current date is used
    * `type` (optional): type of this transaction (string), if empty defaults to
      '' (empty string)
    * `comment` (optional): user remarks about this transaction, if empty
      defaults to '' (empty string)
* `/api/income` and `/api/expenses` query parameters
  * `?limit=[INTEGER]` to limit the amount of returned Records
  * `?dateFrom=[DATESTRING]&dateTo=[DATESTRING]` to display only Records between
    two specified dates (both inclusive); dates must be in `YYYY-MM-DD` format
* `/api/income/:id` and `/api/expenses/:id` methods, where `:id` is an integer
  * `GET` to retrieve a single Record with given ID
  * `PUT` a JSON body with `application/json` header to update an existing
    Record entry; it allows the same key-value pairs as `POST`
  * `DELETE` to remove the specified Record entry; 
    **there is no undo function on the API level!**
* `/api/register` allows user account creation, and it only allows one method
  * `POST` to create a new user, only if the username is unique; it must be a
    JSON body request with following keys
    ** `username`
    ** `password` - at least 8 characters long
* `/api/login` allows to retrieve a [JSON Web Token](https://jwt.io/), only if
  proper user credentials are sent via a JSON body request; this endpoint also
  only supports POST methods with following keys:
    ** `username`
    ** `password`

## Authorization
As noted above, authorization is done by means of JSON Web Tokens (JWT). After
registering, client sends a `POST` request to `/api/login` with proper
credentials, and receives an encoded JW token. To succesfully use it, clients
need to add the following header to every request made to `/api/income` or
`/api/expenses` endpoints:

```
Authorization:Bearer <JSON Web Token goes here>
```

Without proper JWT, clients won't be able to use those endpoints.

## Credits

Created by Mateusz Makowski <matmakos[at]gmail.com>
License ??? not specified yet (c) 2020
