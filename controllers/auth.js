const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  })
}

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res) => {
  const { email } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect('/')
      }
      req.session.isLoggedIn = true
      req.session.user = user
      return req.session.save()
    })
    .catch((err) => console.log(err))
}

exports.postSignup = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.redirect('/signup')
      }
      const hashedPassword = bcrypt.hash(password, 12)
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      })
      return newUser.save()
    })
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}
