### This is Simple Express Starter Kit

##### Node express + Prisma ORM + graphql js SDL modulerized - graphql api 

You can use it for your project. If it is useful for you,  
don't forget to give me a **GitHub star**, please.

In this node/express template

   - Express framework 
   - DB - MySQL or PostgreSQL 
   - Prisma ORM
   - graphql api ( graphql.js, graphql-http, graphql-tools) 
   - JWT auth
   - bcrypt
   - validator 
   - error handler 
   - file uploading 
   - Authorization
   - Pagination etc.

In order to use it,

Create a .env file and add this.  
For MySQL

```
DATABASE_URL="mysql://username:password@localhost:3306/mydb"
TOKEN_SECRET="something hard to guess"

```
For PostgreSQL

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
TOKEN_SECRET="something hard to guess"

```
Please note.   
*TOKEN_SECRET* should be complex and hard to guess.  

`File Uploading Process`  

If you use file uploading feature in this kit,  
create nested folders `uploads/images` in the root directory.  
But making directories is up to you. You can configure in `src/utils/uploadFile.js`.  
My method is to use REST endpoints specifically for file uploads while keeping   
the GraphQL API for other operations. This approach leverages the strengths of   
both REST and GraphQL and can simplify the file upload process.  

That's why, first, you should call REST endpoint for file upload.  
It will give a response with image url link. And then, graphql api can be called  
as usual in order to store that link in the database. Done!  

For large projects, it is the best solution to use aws S3, DigitalOcean space, etc., instead of using file system.  

After git clone, it should be run.

```
npm install
npm start

```   
Warning - every `*.graphql & *.resolver.js` must be inside three nested folders `./**/**/**/file` .  
It's ok `./src/graphql/auth/auth.graphql` or `./src/graphql/product/product.graphql` or something like that.  

If you have something hard to solve,
DM  
<phonenai2014@gmail.com>  
<https://www.facebook.com/phonenyo1986/>  
<https://www.linkedin.com/in/phone-nyo-704596135>  

#### Find more other Starter kits of mine ?   

`My Kits For REST Api`
  
  [Express + Prisma ORM + mongodb - rest api](https://github.com/Bonekyaw/node-express-prisma-mongodb)  
  [Express + Prisma ORM + SQL - rest api](https://github.com/Bonekyaw/node-express-prisma-rest)  
  [Express + mongodb - rest api](https://github.com/Bonekyaw/node-express-mongodb-rest)  
  [Express + mongoose ODM - rest api](https://github.com/Bonekyaw/node-express-nosql-rest)  
  [Express + sequelize ORM - rest api](https://github.com/Bonekyaw/node-express-sql-rest)  

`My Kits For Graphql Api`

  [Apollo server + Prisma ORM + SDL modulerized - graphql api](https://github.com/Bonekyaw/apollo-graphql-prisma)  
  [Express + Prisma ORM + graphql js SDL modulerized - graphql api](https://github.com/Bonekyaw/node-express-graphql-prisma) - Now you are here  
  [Express + Apollo server + mongoose - graphql api](https://github.com/Bonekyaw/node-express-apollo-nosql)  
  [Express + graphql js + mongoose - graphql api](https://github.com/Bonekyaw/node-express-nosql-graphql)  
  [Express + graphql js + sequelize ORM - graphql api](https://github.com/Bonekyaw/node-express-sql-graphql)  





