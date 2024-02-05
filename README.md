### Folder Structure

app.js file is the file where the application bootstraps.

## Folders
1) middleware
    It has all the middleware configured.
    1) auth.js to check if the user is making the request with a valid jwt token.
    2) role.js As the applcation demands a few actions which is role dependent hence this middleware is required.
       
2) models
   Since the application has two major things which are inventory and users, hence two models are required to store relevant data.

3) routes
    auth.js This route is for login and registration purpose. It involves hashing of password and generation of jwt token.
    users.js This route provides data related to the users and also has a sub route which works on the basis of id.
    inventory.js
       This route provides inventory related data and it also has sub routes which fetches/updated/deletes invetory data based on the id.
       All the unnecessary routes are validated with valid error messages.
    
   
