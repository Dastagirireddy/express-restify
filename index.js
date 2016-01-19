var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    bodyParser = require('body-parser');

Promise.promisifyAll(mongoose);

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
 *  mongoose.connect('mongodb://localhost:27017/dbname');
 *  var REST = require('express-restify')(app);
 * step2:
 *  var UserSchema = new mongoose.Schema({name: String, password: String, etc,..});
 * step3:
 *  var UserModel = mongoose.model('User', UserSchema, 'users');
 * step4:
 *  REST.register({url: '/api/users', model: 'User'});
 */
module.exports = function(app) {

    if(!app) {

        throw new Error('Instance of an express framework is required..!');
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

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
    function Register(options) {

        var url, modelName;

        if(typeof options === 'object') {

            url = options.url;
            modelName = options.model;
            restrict = options.restrict;
        } else {

            throw new Error('Exprected an Object but got an ' + typeof options);
        }

        if(!url) {

            throw new Error('Url is required..!');
        } else if(!modelName) {

            throw new Error('Model name is required..!');
        }

        var modelObj = mongoose.model(modelName),
            schema = mongoose.model(modelName).schema;

        if(restrict && Array.isArray(restrict)) {

            options['restrict'].forEach(function(index) {

                schema.paths[index].options['select'] = false;
                schema.paths[index]['selected'] = false;
            });
        }

        var keys = Object.keys(schema.paths);

        /**
         * [findById - To query the records based on _id]
         * @param  {Object}   req  [request]
         * @param  {Object}   res  [response]
         * @param  {Function} next [callback]
         * @return {Json}        [returns json data]
         */
        function findById(req, res, next) {

            var id = req.params.id;

            modelObj
                .findByIdAsync(id)
                .then(function(result) {

                    res.json(result);
                })
                .catch(function(error) {

                    next();
                });
        }

        /**
         * [findByIdAndRemove - To query the record based on _id and remove the document]
         * @param  {Object}   req  [request]
         * @param  {Object}   res  [response]
         * @param  {Function} next [callback]
         * @return {Json}        [returns json data]
         */
        function findByIdAndRemove(req, res, next) {

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
        }

        /**
         * [findByIdAndUpdate - To query the record based on _id and update the document]
         * @param  {Object}   req  [request]
         * @param  {Object}   res  [response]
         * @param  {Function} next [callback]
         * @return {Json}        [returns json data]
         */
        function findByIdAndUpdate(req, res, next) {

            var id = req.params.id;
            var obj = req.body;

            for(var i in obj) {

                if(i === '_id' || i === '__v') {

                    delete obj[i];
                }
            }

            modelObj
                .findByIdAsync(id)
                .then(function(result) {

                    for(var key in obj) {

                        if(keys.indexOf(key) > -1) {

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
        }

        /**
         * [save - To save document in the database]
         * @param  {Object}   req  [request]
         * @param  {Object}   res  [response]
         * @param  {Function} next [callback]
         * @return {Json}        [returns json data]
         */
        function save(req, res, next) {

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
        }

        /**
         * [findAll - To collect all the documents]
         * @param  {Object}   req  [request]
         * @param  {Object}   res  [response]
         * @param  {Function} next [callback]
         * @return {Json}        [returns json data]
         */
        function findAll(req, res, next) {

            modelObj
                .findAsync({})
                .then(function(result) {

                    res.json(result);
                })
                .catch(function(error) {

                    next();
                });
        }

        /**
         * @router
         * @description perform PUT, DELETE and GET operations (works with ID).
         */
        app.route(url + '/:id')
            .get(findById, errorHandler)
            .delete(findByIdAndRemove, errorHandler)
            .put(findByIdAndUpdate, errorHandler);

        /**
         * @router
         * @description perform GET and POST operations.
         */
        app.route(url)
            .post(save, errorHandler)
            .get(findAll, errorHandler);
    }

    return new Model();
};
