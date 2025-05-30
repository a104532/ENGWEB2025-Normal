const express = require('express');
const router = express.Router();
const edicaoController = require('../controllers/edicao');

// GET /edicoes
router.get('/', function(req, res, next) {
    if (req.query.org) {
        edicaoController.getByOrganizador(req.query.org)
            .then(data => res.jsonp(data))
            .catch(err => res.status(500).jsonp(err));
    } else {
        edicaoController.list()
            .then(data => res.jsonp(data))
            .catch(err => res.status(500).jsonp(err));
    }
});

// GET /edicoes/:id
router.get('/:id', function(req, res, next) {
    edicaoController.getById(req.params.id)
        .then(data => {
            if (data) {
                res.jsonp(data);
            } else {
                res.status(404).jsonp({error: "Edição não encontrada"});
            }
        })
        .catch(err => res.status(500).jsonp(err));
});

// POST /edicoes
router.post('/', function(req, res, next) {
    edicaoController.add(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(err => res.status(500).jsonp(err));
});

// DELETE /edicoes/:id
router.delete('/:id', function(req, res, next) {
    edicaoController.delete(req.params.id)
        .then(data => {
            if (data.deletedCount > 0) {
                res.status(204).end();
            } else {
                res.status(404).jsonp({error: "Edição não encontrada"});
            }
        })
        .catch(err => res.status(500).jsonp(err));
});

// PUT /edicoes/:id
router.put('/:id', function(req, res, next) {
    edicaoController.update(req.params.id, req.body)
        .then(data => {
            if (data.modifiedCount > 0) {
                res.jsonp(data);
            } else {
                res.status(404).jsonp({error: "Edição não encontrada ou sem alterações"});
            }
        })
        .catch(err => res.status(500).jsonp(err));
});

module.exports = router;