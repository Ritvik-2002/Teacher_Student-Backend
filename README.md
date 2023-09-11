
I am creating 2 tables into the database. They are Users and Journal.


Users

Users ie Teacher and Student here I am differentiating teacher and student by an attribute named as role.

 CREATE TABLE Users (
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL PRIMARY KEY,
    password varchar(255) NOT NULL,
    role varchar(12) NOT NULL
);


So using the Users table we will be able to register as Student/Teacher.

POST
@public route
https://ritvik.onrender.com/toddle/user/register  → this is the route to register 

The corresponding information i.e the json objects insertion is provided in the postman collections where the password will be stored in the encrypted format. The reason I kept the register route is because of this statement in the assignment : password comparison should be present.

After the successful completion of register the users can login using the route

POST
@public route
https://ritvik.onrender.com/toddle/user/login  → this is the route to login



GET
@public route
https://ritvik.onrender.com/toddle/user/getall  → this is the route to just check all the users.


 After successful validation of the user we will be given a jwt token which is used to get into the private routes.
Journal

CREATE TABLE Journal(
    id SERIAL PRIMARY KEY,
    email varchar(255) REFERENCES Users(email),
    description VARCHAR(255),
    created_at TIMESTAMPTZ,
    file VARCHAR(255),
    students TEXT[] -- Array of strings
);

Here only the teacher can update/create/delete the journal that I am handling using jwt token i.e I am passing the role as payload in the jwt token and while retrieving i am checking whether the role is teacher or not.

All the routes in the journal are private i.e. without jwt token no one can access.

POST
https://ritvik.onrender.com/toddle/journal/create  → this is the route to create journal

GET
https://ritvik.onrender.com/toddle/journal/teacher/:email   → this is the route to access the journals published by the particular teacher

GET
https://ritvik.onrender.com/toddle/journal/student/:email	→ this is the route to access the journals that are being assigned to the particular students and it is visible only if the created_at timestamp <= current time;

DELETE
https://ritvik.onrender.com/toddle/journal/delete/:email/:id  → this is the route to delete the journals that are being created by the particular teacher
PUT
https://ritvik.onrender.com/toddle/journal/update/:email/:id  → this is the route to update the journals that are being created by the particular teacher

GET
@public route
https://ritvik.onrender.com/toddle/journal/getall → this is the route to just all the journals

**Note : Actually I had deployed the code on render instead of this url https://ritvik.onrender.com use can check ob your local machine **
