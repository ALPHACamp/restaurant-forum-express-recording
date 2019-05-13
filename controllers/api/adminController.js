const fs = require('fs')
const db = require('../../models') 
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '955ea6fa229b9c1'

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Category]
    }).then(restaurants => {
      return res.json({
        restaurants: restaurants
      })
    })
    
  },

  postRestaurant: (req, res) => {
    if(!req.body.name){
      return res.json({ status: 'error', message: "name didn't exist"})
    }
  
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          return res.json({ status: 'success', message: 'restaurant was successfully created'})
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        return res.json({ status: 'success', message: 'restaurant was successfully created'})
      })
     }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.json({ restaurant: restaurant })
    })
  },

  putRestaurant: (req, res) => {
    if(!req.body.name){
      return res.json({ status: 'error', message: "name didn't exist"})
    }
  
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              res.json({ status: 'success', message: 'restaurant was successfully to update'})
            })
          })
      })
    }
    else
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
          .then((restaurant) => {
            res.json({ status: 'success', message: 'restaurant was successfully to update'})
          })
        })
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.json({ status: 'success', message: ''})
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll().then(users => {
      return res.json({
        users: users
      })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            isAdmin: req.body.isAdmin === 'true'
          })
          .then((restaurant) => {
            res.json({ status: 'success', message: 'user was successfully to update'})
          })
        })
  }

}

module.exports = adminController