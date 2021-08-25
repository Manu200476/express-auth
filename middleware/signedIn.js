const isLoggedIn = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/')
  }
}

module.exports = isLoggedIn
