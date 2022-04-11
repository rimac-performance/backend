Rimac Performance App Backend

The backend architecture adheres to MVC framework. The routes folder contains the endpoints, the services folder
contains the logic and communicates with both the routes and DAO folders. The DAO folder contains code that
directly interacts with the database.

Routes ----> Services ----> DAO

The Utils folder contains code that supports the the Routes, Services, and DAO folders.