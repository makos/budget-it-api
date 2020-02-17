# Budget It API Changelog

## 0.1.0 (2020-02-08 - ???)
* Initial public API release
* All needed API routes available:
** /api/income - show 'income' records (e.g. paychecks)
** /api/expenses - show expense records (e.g. shopping)
** /api/login - provide credentials to receive a session JSON Web Token
** /api/register - send credentials and store them in DB to create a new user
** For a better explanation of possible options, see the Readme.md.
* Database schema and interactions working
* Unit tests of all middleware functions (not all methods covered equally)

### TODO:
* Easy deployment of the whole API (scripts, Docker? check out possibilities)
* Documentation of the API endpoints and procedures clients have to follow
