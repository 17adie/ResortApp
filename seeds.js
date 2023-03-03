require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/user")
const Resort = require("./models/resort")
const bcrypt = require("bcrypt")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to mongodb")
  } catch (error) {
    console.log(error)
  }
}

connectDB()

const seeds = async () => {
  const hashPassword = async (str) => {
    try {
      return await bcrypt.hash(str, 10)
    } catch (error) {
      console.log("error:", error)
    }
  }

  const createUser = async () => {
    let data = {
      name: "Aldrine Facistol",
      username: "admin",
      password: "admin123",
    }
    let saltRounds = 10
    let hashedPassword = await bcrypt.hash(data.password, saltRounds)

    data.password = hashedPassword
    console.log(data.password)

    const seedDatabase = async () => {
      try {
        await User.deleteMany({})
        await User.insertMany(data)
        console.log("Seeding successful: User")
      } catch (error) {
        console.log(error)
      }
    }

    seedDatabase().then(() => {
      mongoose.connection.close()
    })
  }

  const createResort = async () => {
    const data = [
      {
        resort_name: "The Lind Boracay",
        uploader_username: "sweet_kristy",
        resort_description: "Night view of relaxing pool with lighting in small hotel",
        resort_address: "876 Gambler Lane, Houston Texas",
        location: {
          type: "Point",
          coordinates: ["29.664394", "-95.553421"],
        },
      },
      {
        resort_name: "Hardywood Resort",
        uploader_username: "bubbly_snowflake",
        resort_description: "Sample Hotel and Resort is renowned for the luxury experience it provides guests and you can rest assured that we will do our utmost to ensure your well-being and safety.",
        resort_address: "3715 Fairfax Drive, Los Angeles California",
        location: {
          type: "Point",
          coordinates: ["34.134735", "-118.165443"],
        },
      },
      {
        resort_name: "Harborview Resort",
        uploader_username: "SteelTitan",
        resort_description: "A swimming pool offers a number of health and wellbeing benefits, including improving muscle tone, making you healthier and less prone to illness, and helping you to relax and unwind. Learn how to create a healthy and sustainable swimming pool with our guide.",
        resort_address: "3716 Burke Street Dedham Massachusetts",
        location: {
          type: "Point",
          coordinates: ["42.211906", "-71.165504"],
        },
      },
      {
        resort_name: "Home Sweet Temporary Home",
        uploader_username: "UltimateBeast",
        resort_description: "At the Sample Hotel and Resort we offer these romantic rooms with a private pool on the terrace as well as beautiful views. Available with open bathroom.",
        resort_address: "2708 Oakwood Avenue New York",
        location: {
          type: "Point",
          coordinates: ["40.629120", "-74.063675"],
        },
      },
      {
        resort_name: "Quick Stop Resort",
        uploader_username: "DarkCarnage",
        resort_description: "At home in the water, on the beach, or in the sea, there are so many ways to make your swimming pool a happy resort.",
        resort_address: "3472 Tennessee Avenue Bloomfield Township Michigan",
        location: {
          type: "Point",
          coordinates: ["42.639133", "-83.182648"],
        },
      },
      {
        resort_name: "Luxury Living Resort",
        uploader_username: "IronMerc",
        resort_description: "Enjoy the serenity and relaxation of your own swimming pool. How to build a swimming pool.",
        resort_address: "2759 Hickory Street Salt Lake City Utah",
        location: {
          type: "Point",
          coordinates: ["40.829994", "-111.884674"],
        },
      },
    ]

    const seedDatabase = async () => {
      try {
        await Resort.deleteMany({})
        await Resort.insertMany(data)
        console.log("Seeding successful: Resort")
      } catch (error) {
        console.log(error)
      }
    }

    seedDatabase().then(() => {
      mongoose.connection.close()
    })
  }

  await createUser()
  await createResort()
}

seeds()
