#express-restify <hr>
A module for making REST full calls easy with mongoose and express.

***

##Install

```

$ npm install express-restify
```

##Database && Framework

```
express-restify
```   
suited for 

```
mongodb
```
database using 

```
mongoose
```

API and suited for 

```
express
```

framework.

##How to use express-restify ?

```js

var app = require('express')(),
      mongoose = require('mongoose'),
mongoose.connect('mongodb://localhost:27017/dbname');
var REST = require('express-restify')(app);
var UserSchema = new mongoose.Schema({name: String, password: String, etc,..});
var UserModel = mongoose.model('User', UserSchema, 'users');
REST.register('/api/users', 'User');
```
### Example
Refer the sample application at following link [test-express-restify](https://github.com/Dastagirireddy/test-express-restify)
