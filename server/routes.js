const express = require('express')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const router = express.Router()


const {
    createNewInvoice,
    allInvoicesForAnUser,
    singleInvoiceView,
    userRegister,
    userLogin,
} = require('./controllers');



router.post('/invoice', multipartMiddleware, createNewInvoice);
router.get('/invoice/user/:user_id/:invoice_id', multipartMiddleware, singleInvoiceView);
router.post('/register', multipartMiddleware, userRegister);
router.post('/login', multipartMiddleware, userLogin)
router.get('/invoice/user/:user_id', multipartMiddleware, allInvoicesForAnUser);


module.exports = router