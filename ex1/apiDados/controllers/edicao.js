const Edicao = require('../models/edicao');

module.exports.list = () => {
    return Edicao.find({}, { anoEdição: 1, organizacao: 1, vencedor: 1, _id: 0 })
        .sort({ anoEdição: 1 })
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

module.exports.getById = id => {
    return Edicao.findOne({ id: id })
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

module.exports.getByOrganizador = org => {
    return Edicao.find({ organizacao: org }, { anoEdição: 1, organizacao: 1, vencedor: 1, _id: 0 })
        .sort({ anoEdição: 1 })
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

module.exports.listOrganizadores = () => {
    return Edicao.aggregate([
        { $group: {
            _id: "$organizacao",
            anos: { $push: "$anoEdição" }
        }},
        { $sort: { _id: 1 } },
        { $project: {
            _id: 0,
            país: "$_id",
            anos: 1
        }}
    ])
    .then(res => res)
    .catch(err => {
        throw err;
    });
};

module.exports.listVencedores = () => {
    return Edicao.aggregate([
        { $match: { vencedor: { $exists: true, $ne: null } } },
        { $group: {
            _id: "$vencedor",
            anos: { $push: "$anoEdição" }
        }},
        { $sort: { _id: 1 } },
        { $project: {
            _id: 0,
            país: "$_id",
            anos: 1
        }}
    ])
    .then(res => res)
    .catch(err => {
        throw err;
    });
};

module.exports.listInterpretes = () => {
    return Edicao.aggregate([
        { $unwind: "$musicas" },
        { $group: {
            _id: {
                intérprete: "$musicas.intérprete",
                país: "$musicas.país"
            }
        }},
        { $sort: { "_id.intérprete": 1 } },
        { $project: {
            _id: 0,
            intérprete: "$_id.intérprete",
            país: "$_id.país"
        }}
    ])
    .then(res => res)
    .catch(err => {
        throw err;
    });
};

module.exports.add = edicao => {
    return Edicao.create(edicao)
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

module.exports.update = (id, edicao) => {
    return Edicao.updateOne({ id: id }, { $set: edicao })
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

module.exports.delete = id => {
    return Edicao.deleteOne({ id: id })
        .then(res => {
            if (res.deletedCount === 0) {
                throw new Error("Edição não encontrada");
            }
            return res;
        })
        .catch(err => {
            throw err;
        });
};