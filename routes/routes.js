const express = require('express');
const router = express.Router();

const passport = require('../config/passport')

const adminController = require('../controllers/adminController.js')
const restController = require('../controllers/restController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const userController = require('../controllers/userController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/', (req, res) => res.redirect('/restaurants'))

router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

module.exports = router;
