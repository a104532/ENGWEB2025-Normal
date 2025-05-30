const express = require('express');
const router = express.Router();
const edicaoController = require('../controllers/edicao');

// GET /interpretes
router.get('/', function(req, res, next) {
    edicaoController.listInterpretes()
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err));
});

module.exports = router;