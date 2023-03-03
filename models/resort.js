const mongoose = require("mongoose")

const resortSchema = new mongoose.Schema({
  resort_name: {
    type: String,
    required: true,
  },
  uploader_username: {
    type: String,
    required: true,
  },
  resort_description: {
    type: String,
    required: true,
  },
  resort_address: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  // reviews: {},
})

const Resort = mongoose.model("Resort", resortSchema)

module.exports = Resort
