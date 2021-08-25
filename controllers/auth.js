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
  User.findById('5bab316ce0a7c75f783cb8a8')
    .then((user) => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save((err) => {
        console.log(err)
        res.redirect('/')
      })
    })
    .catch((err) => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.redirect('/signup')
      }
      const newUser = new User({
        email,
        password,
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
