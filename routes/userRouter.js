const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const User = require("../models/user")
const Resort = require("../models/resort")
const bcrypt = require("bcrypt")
const moment = require("moment")
const coverPhotos = require("../coverPhotos")

router.get("/sign-in", (req, res) => {
  res.render("user/sign-in")
})

router.get("/sign-up", (req, res) => {
  res.render("user/sign-up")
})

// view
router.get("/profile", async (req, res) => {
  const resorts = await Resort.find({})
  const list = resorts.map((v, i) => {
    const date_posted = moment(v.date_posted, "YYYYMMDD").fromNow()
    return `<div class="col">
              <div class="card h-100">
                <img src="${coverPhotos[i]}" class="card-img-top" alt="..." />
                <div class="card-body">
                  <h4 class="card-title">${v.resort_name}</h4>
                  <small class="card-text">${v.resort_address}</small>
                  <br>
                  <small class="text-muted"><strong>${v.uploader_username}</strong> • ${date_posted}</small>
                    <hr>
                    <p class="text-muted">${v.resort_description}</p>
                  </div>
                  <div class="card-footer">
                    <a class="btn btn-sm btn-link float-end" href="/user/view-resorts/${v._id}" role="button">View more details</a>
                  </div>
              </div>
            </div>`
  })

  res.render("user/profile", { list: list.join("") })
})

// view individually
router.get("/view-resorts/:id", async (req, res) => {
  const { id } = req.params
  const resort = await Resort.findById(id)
  res.render("user/view-resorts", { resort, date_posted: moment(resort.date_posted).format("MMM Do YY") })
})

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  let error_message = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>Invalid!</strong> Incorrect username or password.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                          </div>`

  if (user != null) {
    bcrypt.compare(password, user.password, function (err, result) {
      console.log(result)
      if (result) {
        res.redirect("/user/profile")
      } else {
        res.render("user/sign-in", { error_message })
      }
    })
  } else {
    res.render("user/sign-in", { error_message })
  }
})

// insert
router.post("/sign-up", [check("name").notEmpty().trim(), check("username").notEmpty().trim(), check("password").notEmpty().trim(), check("confirm_password").notEmpty().trim()], async (req, res) => {
  const errors = validationResult(req)
  const { name, username, password, confirm_password } = req.body // for refresh/submit : to get the value : see new.ejs input value

  if (!errors.isEmpty()) {
    let error_message = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                          <strong>Warning!</strong> Please fill out all required fields.
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`

    res.render("user/sign-up", { name, username, password, confirm_password, error_message })
    return
  }

  if (password != confirm_password) {
    let error_message = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>Error!</strong> Passwords do not match.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`

    res.render("user/sign-up", { name, username, password, confirm_password, error_message })
    return
  }

  // todo: username validation

  let saltRounds = 10
  let hashedPassword = await bcrypt.hash(password, saltRounds)

  let data = {
    name,
    username,
    password: hashedPassword,
  }

  const newUser = new User(data)
  await newUser.save()
  res.redirect("/user/sign-in")
})

module.exports = router
