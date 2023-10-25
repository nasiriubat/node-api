
<!-- DATABASE_URL = mongodb+srv://nasirautonomy:id@cluster0.sr0nedv.mongodb.net/

#Replace VID


# JWT configuration
JWT_SECRET=
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

# Port for your server
PORT=3000 -->



A simple node js api project using node,express and mongodb

Installation:
-------------

1. clone this repository
2. open mongodb compass and connect to your shared cluster url
2. run npm install & npm start

API endpoints:
--------------

//post module

Get all posts                       | GET               | http://localhost:3000/api/posts

Create new post                     | POST              | http://localhost:3000/api/posts

Get single posts                    | GET               | http://localhost:3000/api/getOne/id

Update post                         | PATCH             | http://localhost:3000/api/update/id

Delete post                         | DELETE            | http://localhost:3000/api/delete/6477003c5174619263d86d11


