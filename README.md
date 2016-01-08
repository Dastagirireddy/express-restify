#express-restify 
***
##Purpose
A module for making REST full calls easy with mongoose and express.

##Install

```
$ npm install express-restify
```

##Suited Database && Framework && API`s

`express-restify` suited for below specified frameworks and database only.

```
Database    - **MongoDB**
Framework   - **Express**
API         - **mongoose**
```   

## API:

```js
var REST = require('express-restify')(app);
```

##REST
`REST` object contains a `register` method for registering with REST services.

###REST.register(options)
Create a REST middleware with the given `options`.

####Options
`express-restify` accepts these properties in the options object.

#####url
An url of the route for REST service.

#####model
Model name of a `mongoose collection`.

#####restrict
An array to `restrict` the properties while retrieving the data from the database. 

```js
REST.register({
      url: '/api/users',
      model: 'User',
      restrict: ['password']
});
```

So in this we are restricting the `password` feild, this won't be supplied to browser in any query response.

###Example
The first step is load the `express`, `mongoose` and store the instance of an express in a variable.

```js
var app = require('express')(),
      mongoose = require('mongoose'),
```

The second step is create a connection to the `mongodb` using `mongoose.connect`, create a new `Schema` with required properties and create a model using `mongoose.model`.

```js
var UserSchema = new mongoose.Schema({name: String, password: String, address: String}});
var UserModel = mongoose.model('User', UserSchema, 'users');
```

The third step is load the `express-restify` module and call the method with an argument aninstance of `express` variable.

```js
var REST = require('express-restify')(app);
```

The fourth step Registration and this will take care of all the REST functionalities.

```js
REST.register({
      url: '/api/users',
      model: 'User'
});
```

### Example
Refer the sample application at following link [test-express-restify](https://github.com/Dastagirireddy/test-express-restify)
