/**
 * Created by Roohi on 18-Feb-17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('flock');
});

module.exports = router;
