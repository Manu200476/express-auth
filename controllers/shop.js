const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then((result) => {
      console.log(result)
      res.redirect('/cart')
    })
}

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
}

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => ({ quantity: i.quantity, product: { ...i.productId._doc } }))
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      })
      return order.save()
    })
    .then(() => {
      req.user.clearCart()
      res.redirect('/orders')
    })
    .catch((err) => console.log(err))
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch((err) => console.log(err))
}
