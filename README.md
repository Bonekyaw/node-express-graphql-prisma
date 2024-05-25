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
   - error handler etc.

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

  [Apollo server + Prisma ORM + SDL modulerized - graphql api](https://github.com/Bonekyaw/apollo-graphql-prisma)  
  Now you are here - [Express + Prisma ORM + graphql js SDL modulerized - graphql api](https://github.com/Bonekyaw/node-express-graphql-prisma)  
  [Express + Prisma ORM + mongodb - rest api](https://github.com/Bonekyaw/node-express-prisma-mongodb)  
  [Express + Prisma ORM + SQL - rest api](https://github.com/Bonekyaw/node-express-prisma-rest)  
  [Express + Apollo server + mongoose - graphql api](https://github.com/Bonekyaw/node-express-apollo-nosql)  
  [Express + graphql js + mongoose - graphql api](https://github.com/Bonekyaw/node-express-nosql-graphql)  
  [Express + graphql js + sequelize ORM - graphql api](https://github.com/Bonekyaw/node-express-sql-graphql)  
  [Express + mongodb - rest api](https://github.com/Bonekyaw/node-express-mongodb-rest)  
  [Express + mongoose ODM - rest api](https://github.com/Bonekyaw/node-express-nosql-rest)  
  [Express + sequelize ORM - rest api](https://github.com/Bonekyaw/node-express-sql-rest)  





