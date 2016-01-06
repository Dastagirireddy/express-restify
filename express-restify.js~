/**
 * Module
 * @param  {Object}
 * @param  {Object}
 * @return {Object}
 * @description
 * Accepts instance of an express module and mongoose module
 * Returns new Instance of Model Class.
 * This node_module handles frequently used GET, POST, DELETE and PUT methods for any Mongoose collection
 * @example
 *
 * step1:
 *  var app = require('express')(),
 *      mongoose = require('mongoose'),
 *      Promise = require('bluebird');
 *  Promise.promisifyAll(mongoose);
 *  mongoose.connectAsync('mongodb://localhost:27017/dbname');
 *  var REST = require('express-restify')(app, mongoose);
 * step2:
 *  var UserSchema = new mongoose.Schema({name: String, password: String, etc,..});
 * step3:
 *  var UserModel = mongoose.model('User', UserSchema, 'users');
 * step4:
 *  REST.register('/api/users', 'User');
 */
module.exports = function(app, mongoose) {

    /**
     * @class Model
     */
    function Model() {

        var self = this;
    }

    /**
     * [register method accepts url and mongodb model name]
     * @type {prototype}
     */
    Model.prototype.register = Register;

    /**
     * @param  {Object}
     * @param  {Object}
     * @return {response}
     */
    function errorHandler(req, res) {

        res.statusCode = 403;
        res.end();
    }

    /**
     * @param {String}
     * @param {String}
     * @description Accepts url and model name perform major get, put, delete and post funcatinolities.
     */
    function Register(url, modelName) {

        var modelObj = mongoose.model(modelName),
            schema = mongoose.model(modelName).schema;

        var keys = Object.keys(schema.paths);

        /**
         * @router
         * @description perform PUT, DELETE and GET operations (works with ID).
         */
        app.route(url + '/:id')
            .get(function(req, res, next) {

                var id = req.params.id;
                modelObj
                    .findByIdAsync(id)
                    .then(function(result) {

                        res.json(result);
                    })
                    .catch(function(error) {

                        next();
                    });
            }, errorHandler)
            .delete(function(req, res, next) {

                var id = req.params.id;
                modelObj
                    .findByIdAndRemoveAsync(id)
                    .then(function(result) {

                        res.json({
                            message: 'user deleted successfully.'
                        });
                    })
                    .catch(function(err) {

                        next();
                    });
            }, errorHandler)
            .put(function(req, res, next) {

                var id = req.params.id;
                var obj = req.body;
                modelObj
                    .findByIdAsync(id)
                    .then(function(result) {

                        for(var key in obj) {

                            if(result.hasOwnProperty(key)) {

                                result[key] = obj[key];
                            }
                        }
                        return result.saveAsync();
                    })
                    .then(function(data) {

                        res.json(data);
                    })
                    .catch(function(err) {

                        next();
                    });
            }, errorHandler);

        /**
         * @router
         * @description perform GET and POST operations.
         */
        app.route(url)
            .post(function(req, res, next) {

                var obj = req.body;
                var model = new modelObj();

                for(var key in obj) {

                    if(keys.indexOf(key) > -1) {

                        model[key] = obj[key];
                    }
                }

                model
                    .saveAsync()
                    .then(function(result) {

                        res.json(result);
                    })
                    .catch(function(error) {

                        next();
                    });
            }, errorHandler)
            .get(function(req, res, next) {

                modelObj
                    .findAsync({})
                    .then(function(result) {

                        res.json(result);
                    })
                    .catch(function(error) {

                        next();
                    });
            }, errorHandler);
    }

    return new Model();
};
