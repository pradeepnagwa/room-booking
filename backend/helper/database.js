let mongoose = require("mongoose");
require('dotenv').config();

module.exports = {
    connect: function () {
        const srv = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.CLUSTER}.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
        mongoose.connect(srv);
        console.log('connected to db');
        // mongodb+srv://pradeep:y22hvVUtgY7ztk6F@test-cluster.8hx2tpu.mongodb.net/?retryWrites=true&w=majority&appName=test-cluster
        mongoose.Promise = global.Promise;
    },
    initModels: function () {
        mongoose.pluralize(null);
        require('../models');
    }
};