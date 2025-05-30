const express = require('express');
const router = express.Router();
const edicaoController = require('../controllers/edicao');

// GET /paises?papel=org
// GET /paises?papel=venc
router.get('/', function(req, res, next) {
    if (req.query.papel === 'org') {
        edicaoController.listOrganizadores()
            .then(data => res.jsonp(data))
            .catch(err => res.status(500).jsonp(err));
    } else if (req.query.papel === 'venc') {
        edicaoController.listVencedores()
            .then(data => res.jsonp(data))
            .catch(err => res.status(500).jsonp(err));
    } else {
        res.status(400).jsonp({error: "Parâmetro 'papel' inválido. Use 'org' ou 'venc'"});
    }
});

module.exports = router;