const bcrypt = require('bcrypt-nodejs') 
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '955ea6fa229b9c1'

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if(req.body.passwordCheck !== req.body.password){
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })  
        }
      })    
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },
 
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
 
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Comment, include: Restaurant }
      ]
    }).then(user => {
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      return res.render('user/profile', { profile: user, isFollowed: isFollowed })
    })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('user/edit', {user: user})
    })
  },
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return res.redirect(`/users/${req.params.id}`)
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: img.data.link,
            })
            .then((user) => {
              res.redirect(`/users/${req.params.id}`)
            })
          })
      })
    }
    else
      return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name
            })
            .then((user) => {
              res.redirect(`/users/${req.params.id}`)
            })
          })
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.redirect('back')
     })
   },
   
   removeFavorite: (req, res) => {
    return Favorite.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.redirect('back')
         })
      })
   },

   addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.redirect('back')
     })
   },
   
   removeLike: (req, res) => {
    return Like.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((like) => {
        like.destroy()
         .then((restaurant) => {
           return res.redirect('back')
         })
      })
   },

   getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
      }))
      users = users.sort((a,b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
   },

   addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
     .then((followship) => {
       return res.redirect('back')
     })
   },
   
   removeFollowing: (req, res) => {
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect('back')
         })
      })
   }
}

module.exports = userController