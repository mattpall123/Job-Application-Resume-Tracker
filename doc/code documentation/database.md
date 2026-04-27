# Database Documentation

SQLite is used for the database. This application is meant to be run locally. 

## Schema
Use
http://localhost:8080/swagger-ui/index.html
To see Schemas
Or look at the model classes directly

Database is managed via JDBC Driver. 
Hibernate is used
- Instead of long sql strings hibernate looks at model classes and handles database connection

Database when generated creates a database.db file stored in the backend. You can run sql commands in the backend folder to run direct commands

Run the Database
```
cd backend
sqlite3 database.db
```