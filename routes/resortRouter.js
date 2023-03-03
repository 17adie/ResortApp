const express = require("express")
const moment = require("moment")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const Resort = require("../models/resort")
const coverPhotos = require("../coverPhotos")

// View all resorts
router.get("/", async (req, res) => {
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
                    <a class="btn btn-sm btn-link float-end" href="/resort/view/${v._id}" role="button">View more details</a>
                  </div>
              </div>
            </div>`
  })

  res.render("main", { list: list.join("") })
})

// view individually
router.get("/view/:id", async (req, res) => {
  const { id } = req.params
  const resort = await Resort.findById(id)
  res.render("resort/viewDetails", { resort, date_posted: moment(resort.date_posted).format("MMM Do YY") })
})

// insert form
router.get("/new", async (req, res) => {
  res.render("resort/new", { error_message: "" })
})

// insert
router.post("/new", [check("resort_name").notEmpty().trim(), check("resort_description").notEmpty().trim(), check("resort_address").notEmpty().trim()], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let error_message = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                          <strong>Warning!</strong> Please fill out all required fields.
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`
    const { resort_name, resort_address, resort_description } = req.body // for refresh/submit : to get the value : see new.ejs input value
    res.render("resort/new", { resort_name, resort_address, resort_description, error_message })
    return
  }

  const { resort_name, resort_description, resort_address } = req.body

  // const newResort = new Resort(req.body)
  // console.log(newResort)

  const data = {
    resort_name,
    resort_description,
    resort_address,
    uploader_username: "test_dummy",
    location: {
      type: "Point",
      coordinate: ["11.11", "22.22"],
    },
  }

  const newResort = new Resort(data)
  await newResort.save()
  res.redirect("/user/profile")
})

// edit form
router.get("/edit/:id", async (req, res) => {
  const { id } = req.params
  const resort = await Resort.findById(id)
  res.render("resort/edit", { resort, error_message: "", id })
})

// edit a resort
router.patch("/edit/:id", [check("resort_name").notEmpty().trim(), check("resort_description").notEmpty().trim(), check("resort_address").notEmpty().trim()], async (req, res) => {
  const errors = validationResult(req)
  const { id } = req.params

  if (!errors.isEmpty()) {
    let error_message = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                          <strong>Warning!</strong> Please fill out all required fields.
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`
    // const resort = await Resort.findById(id)
    const resort = req.body
    res.render("resort/edit", { resort, error_message, id })
    return
  }
  const resort = await Resort.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
  res.redirect(`/user/view-resorts/${resort._id}`)
})

// delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  const deleteResort = await Resort.findByIdAndDelete(id)
  res.redirect("/user/profile")
})

module.exports = router
