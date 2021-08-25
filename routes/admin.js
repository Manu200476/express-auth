const express = require('express')
const adminController = require('../controllers/admin')
const { isLoggedIn } = require('../middleware/signedIn')

const router = express.Router()

router.get('/add-product', isLoggedIn, adminController.getAddProduct)
router.get('/products', isLoggedIn, adminController.getProducts)
router.post('/add-product', isLoggedIn, adminController.postAddProduct)
router.get('/edit-product/:productId', isLoggedIn, adminController.getEditProduct)
router.post('/edit-product', isLoggedIn, adminController.postEditProduct)
router.post('/delete-product', isLoggedIn, adminController.postDeleteProduct)

module.exports = router
