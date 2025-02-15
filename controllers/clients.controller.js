const express = require('express') // importando o modulo express
const router = express.Router()
const usersLogedRoutes = require('../controllers/users.loged.controller')
const Clients = require('../models/clients.model') 
const phoneClients = require('../models/phoneClients.model')
//const { title } = require('process')

// consulta
router.get('/', usersLogedRoutes, (req, res) => { 
    const firstName = req.cookies.firstName
    Clients.find().lean()
    .then(data => {
        res.render('clients/list', { firstName: firstName, title: "Cadastro de clientes", page: "Listar clientes cadastrados", clients: data})
    })
    .catch(err => 
        console.log('erro ao processar a operação: \n', err)
    )
})

router.get('/addOrEdit', usersLogedRoutes, (req, res) => {
    const firstName = req.cookies.firstName
    res.render('clients/addOrEdit', { firstName: firstName, title: "Cadastro de clientes", page: "Inseir novo cliente" })
})

// inserir
router.post('/addOrEdit', usersLogedRoutes, (req, res) => {
    const clients = {
        name: req.body.name,
        emailAddress: req.body.emailAddress,
        cpf: req.body.cpf, 
        birthday: req.body.birthday, 
        genere: req.body.genere,
        clientSince: req.body.clientSince,
        address: { street: req.body.street, 
                        number: req.body.number, 
                        city: req.body.city, 
                        zipCode: req.body.zipCode, 
                        neighborhood: req.body.neighborhood, 
                        state: req.body.state, 
                        country: req.body.country, 
                }
    }

    //console.log(clients)
    const { _id} = req.body
    if(_id == '')
        new Clients({...clients}).save()
    .then(data => res.redirect('/clients'))
    .catch(err => console.log('erro durante a insersão de dados: \n', err))
    else
    Clients.findByIdAndUpdate(_id, clients)
    .then(data => res.redirect('/clients'))
    .catch(err => console.log('erro durante a atualização de dados: \n', err))
})

// consulta telefones de contato
router.get('/getPhoneNumber', usersLogedRoutes, (req, res) => { 
    phoneClients.find({ "client_id": req.query.client_id}).lean()
    .then(data => res.json(data))
    .catch(err => 
        console.log('erro ao processar a operação: \n', err)
    )
})

//adicionar telefone
router.get('/addPhoneNumber', usersLogedRoutes, (req, res) => {
    const phoneClient = {
        client_id: req.query.client_id,
        ddd: req.query.ddd, 
        phone: req.query.phone, 
        type: req.query.type, 
        whatsapp: req.query.whatsapp, 
    }
    new phoneClients({...phoneClient}).save()
    .then( res.send(true))
    .catch(err =>
        console.log('Erro ao inserir telefone de contato.', err))
})

//editar
router.get('/addOrEdit/:id', usersLogedRoutes, (req, res) => {
    const firstName = req.cookies.firstName
    Clients.findById(req.params.id).lean()
    .then( data => res.render('clients/addOrEdit', { firstName: firstName, title: "Cadastro de clientes", page: "Editar dados do cliente", clients: data }))
    .catch(err =>
        console.log('Erro ao recuperar dados do id especificado', err))
})

//rota delete
router.get('/delete/:id', usersLogedRoutes, (req, res) => {
    Clients.findByIdAndDelete(req.params.id)
    .then(data => res.redirect('/clients'))
    .catch(err => console.log('erro ao remover o registro:\n', err))
}) 

module.exports = router