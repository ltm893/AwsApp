const { Model, QueryTypes } = require("sequelize");
const db = require("../../models");
const e = require("express");

exports.bikeTableAttrs = async (req, res, next) => {
    const bikeTableObj = {};

    let bikeTables, metabikeTables;
    try {
        [bikeTables, metabikeTables] = await db.sequelize.query('show tables');
    }
    catch (err) {
        console.log("Show Tables Error") ; 
        console.log(err);
        return false;
    }


    for (const t of bikeTables) {
        let attrs, metaAttrs;
        let bikeTableName = t['Tables_in_bikedb'];
        try {
            [attrs, metaAttrs] = await db.sequelize.query('describe ' + bikeTableName);
        }
        catch (err) {
            console.log("Describe Err")
            console.log(err);
            return false
        }
        let attrArr = [];
        let fkArr = [];
        bikeTableObj[bikeTableName] = {};
        bikeTableObj[bikeTableName]['attrs'] = [];
        bikeTableObj[bikeTableName]['fk'] = [];
        for (const attr of attrs) {
            if (attr['Field']) {
                attrArr.push(attr['Field']);
            }
            if (attr['Key'] === "MUL") {
                fkArr.push(attr['Field']);
            }
        }
        console.log(attrArr.length);
        if (attrArr.length > 0) {
            bikeTableObj[bikeTableName]['attrs'] = [...attrArr];

        }
        if (fkArr) {
            bikeTableObj[bikeTableName]['fk'] = fkArr;
        }
    }

    res.json(bikeTableObj);


}

exports.bikeInfoByParams = async (req, res, next) => {
    const table = req.query.table;
    const filterAttr = req.query.filter;
    const filterValue = req.query.value;
    let answer;
    const paramObj = {};
    paramObj[filterAttr] = filterValue;
    const whereObj = {};
    whereObj['where'] = paramObj;
    switch (table) {
        case 'bikes':
            try {
            answer = await db.Bike.findAll(whereObj);
            }
            catch(err) {
                console.log("Find all bikes Error") ; 
                console.log(err)
            }
            break;
        case 'brands':
            answer = await db.Brand.findAll(whereObj);
            break;
        case 'categories':
            answer = await db.Category.findAll(whereObj);
            break;
        case 'customers':
            answer = await db.Customer.findAll(whereObj);
            break;
        case 'orderitems':
            answer = await db.Orderitems.findAll(whereObj);
            break;
        case 'orders':
            answer = await db.Order.findAll(whereObj);
            break;
        case 'staffs':
            answer = await db.Staff.findAll(whereObj);
        case 'stocks':
            answer = await db.Stock.findAll(whereObj);;
            break;
        case 'stores':
            answer = await db.Store.findAll(whereObj);
            break;
    }
    res.json(answer);
}

exports.idNameSelect = async (req, res, next) => {
    const table = req.query.table;
    let queryString;
    if (table === 'customers' || table === 'staffs') {
        queryString = "SELECT id, concat(first_name, ' ', last_name) as name FROM " + table;
    } else if (table === 'orders') {
        queryString = "SELECT id, concat(customerId, ' ', bikeId) as name FROM " + table;
    }
    else {
        queryString = "SELECT id, name FROM " + table;
    }

    const [answer, metaData] = await db.sequelize.query(
        queryString, { plain: false },
        {
            type: QueryTypes.SELECT
        }
    );
    console.log(answer)
    res.json(answer);
}

exports.addBike = async (req, res, next) => {
    returnObj = {}
    bike = {};
    bike.name = req.body.name;
    bike.year = req.body.year;
    bike.price = req.body.price;
    let bikeInsertAnswer;
    try {
        bikeInsertAnswer = await db.Bike.create(bike);
        res.json(bikeInsertAnswer)
    }
    catch (err) {
        res.json(err.errors);
    }
}

exports.allBikes = async (req, res, next) => {
    const answer = await db.Bike.findAll();
    res.json(answer);
    //abc
}

exports.BikeById = async (req, res, next) => {
    let answer = await db.Bike.findByPk(req.query.id)
    res.json(answer);
}

exports.allBrands = async (req, res, next) => {
    let answer = await db.Brand.findAll()
    res.json(answer);
}

exports.BrandById = async (req, res, next) => {
    let answer = await db.Brand.findByPk(req.query.id)
    res.json(answer);
}

exports.allCategories = async (req, res, next) => {
    let answer = await db.Category.findAll()
    res.json(answer);
}

exports.CategoryById = async (req, res, next) => {
    let answer = await db.Category.findByPk(req.query.id)
    res.json(answer);
}

exports.allCustomers = async (req, res, next) => {
    let answer = await db.Customer.findAll()
    res.json(answer);
}

exports.CustomerById = async (req, res, next) => {
    let answer = await db.Customer.findByPk(req.query.id)
    res.json(answer);
}

exports.allOrders = async (req, res, next) => {
    let answer = await db.Order.findAll()
    res.json(answer);
}

exports.OrderById = async (req, res, next) => {
    let answer = await db.Order.findByPk(req.query.id)
    res.json(answer);
}

exports.allOrderitems = async (req, res, next) => {
    let answer = await db.Orderitems.findAll()
    res.json(answer);
}

exports.OrderitemsById = async (req, res, next) => {
    let answer = await db.Orderitems.findByPk(req.query.id)
    res.json(answer);
}

exports.allStaffs = async (req, res, next) => {
    let answer = await db.Staff.findAll()
    res.json(answer);
}

exports.StaffById = async (req, res, next) => {
    let answer = await db.Staff.findByPk(req.query.id)
    res.json(answer);
}

exports.allStocks = async (req, res, next) => {
    let answer = await db.Stock.findAll()
    res.json(answer);
}

exports.StockById = async (req, res, next) => {
    let answer = await db.Stock.findByPk(req.query.id)
    res.json(answer);
}

exports.StoreById = async (req, res, next) => {
    let answer = await db.Store.findByPk(req.query.id)
    res.json(answer);
}

exports.allStores = async (req, res, next) => {
    let answer = await db.Store.findAll()
    res.json(answer);
}
