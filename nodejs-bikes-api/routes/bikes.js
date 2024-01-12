const express = require('express');

const router = express.Router();

const bikeController = require('../controllers/api/bikes') ; 

router.get('/getBikeTableDetails', bikeController.bikeTableAttrs) ;   
router.get('/getAllBikes', bikeController.allBikes) ;   
router.get('/getBikeById', bikeController.BikeById) ;   
router.get('/getAllbrands', bikeController.allBrands) ; 
router.get('/getBrandById', bikeController.BrandById) ;
router.get('/getAllcategories', bikeController.allCategories) ; 
router.get('/getCategoryById', bikeController.CategoryById) ;
router.get('/getAllcustomers', bikeController.allCustomers) ;
router.get('/getCustomerById', bikeController.CustomerById) ;
router.get('/getAllorders', bikeController.allOrders) ;
router.get('/getOrderById', bikeController.OrderById) ;
router.get('/getAllorderitems', bikeController.allOrderitems) ;
router.get('/getOrderitemsById', bikeController.OrderitemsById) ;
router.get('/getStaffById', bikeController.StaffById) ;
router.get('/getAllstaffs', bikeController.allStaffs) ;
router.get('/getStockById', bikeController.StockById) ;
router.get('/getAllstocks', bikeController.allStocks) ;
router.get('/getStoreById', bikeController.StoreById) ;
router.get('/getAllstores', bikeController.allStores) ;
router.get('/getBikeInfoByParams', bikeController.bikeInfoByParams) ;
router.get('/getIdNameSelect', bikeController.idNameSelect) ; 
router.post('/addBike',bikeController.addBike) ; 
   
module.exports = router;