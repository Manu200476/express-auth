const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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',
  },
}))

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
        return transporter.sendMail({
          to: 'mjcnfcr@iuncuf.com',
          from: 'ijcfu@icfj.com',
          subject: 'cifhcir',
          html: '<h1>vgrvrvrgv</h1>',
        })
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
