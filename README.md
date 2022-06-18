# **News Server Project**

## - Hosted Version -

### gitHub Repository

https://github.com/emilyb93/Backend-Project-Hosting

### Hosted Server

https://news-server-project.herokuapp.com/api

## - Summary -

This repo is an api which showcases back end coding using modules such as express and PSQL. The api is connected to a supplied database for the purpose of testing. The database comprises of 4 different datasets; users, articles, topics, and comments, which all are interconnected through foreign keys in multiple ways.

## - Setup -

###Minimum Versions

Node : 14.16.0
Postgres 8.7.1

To set up this api you will first need to clone from the provided github repo at the top of this readme.

### HTTPS:

```
git clone https://github.com/emilyb93/Backend-Project-Hosting.git
```

### SSL:

```
git clone git@github.com:emilyb93/Backend-Project-Hosting.git
```

### Git CLI:

```
gh repo clone emilyb93/Backend-Project-Hosting
```

After cloning, you will need to install the dependencies:

```
npm i
```

Once the dependencies are installed, you will need to seed the database so that it has data to access:

```
npm run setup-dbs

npm run seed
```

Finally you will need to create 2 files. These files will give the connection file the database name it is to connect to. At the root level of the repo, make 2 files

`.env.development`

insert into this file the following

```
PGDATABASE=nc_news
```

and now create the test file as

`.env.test `

and insert the following into this

```

PGDATABASE=nc_news_test
```

## Testing

You can now begin testing the api either by using jest with the test files to test the api endpoints

```
npm t __tests__/app.test.js
```

or to test the util functions for data manipulation

```
npm t __tests__/utils.test.js
```

If you wish to test the api with a separate app such as insomnia, the default port is 9090.
You can do this by requesting

```
localhost:9090/api
```

The endpoint of /api will return a JSON of all endpoints available on the api, along with possible acceptable queries, expected responses and expected request formats for POST/PATCH/PUT requests.

Thanks for looking, I hope you like the api!
