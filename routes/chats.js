const express = require('express')
const router = express.Router()
const fs = require('fs')



router.get('/index/:nome', (req, res) => {
    var texto = req.params.nome
    res.render('chat/index',{texto})
})

router.get('/conversas', (req, res) => {
    res.render('chat/conversas')
})

module.exports = router