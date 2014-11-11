/* jshint camelcase: false */
/* jshint expr: true */
var chai      = require('chai')
  , expect    = chai.expect
  , Support   = require(__dirname + '/../support')
  , DataTypes = require(__dirname + "/../../lib/data-types")
  , datetime  = require('chai-datetime')

chai.use(datetime)
chai.config.includeStack = true

describe(Support.getTestDialectTeaser("Include"), function () {
  describe('findAndCountAll', function () {

    describe('hasMany', function() {

      it('should be possible to limit a hasMany with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasMany(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[0].id, value: 1.5},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[1].id, value: 2.5}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {
            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    gte: 2
                  }
                }}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(1);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Sprockets');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(2);
              expect(product.prices[1].value).to.equal(2.5);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasMany with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasMany(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'},
            {title: 'Thingies'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[0].id, value: 1.1},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[1].id, value: 2.1},
                {ProductId: products[2].id, value: 2.2},
                {ProductId: products[2].id, value: 2.3}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {

            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    gte: 2
                  }
                }}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Thingies');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(2.2);
              expect(product.prices[1].value).to.equal(2.3);
              done();
            });
          });
        });
      });

    }); //end hasMany

    describe('hasOne', function() {

      it('should be possible to limit a hasOne with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasOne(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[1].id, value: 2}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {
            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    eq: 2
                  }
                }}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(1);
              expect(results.rows.length).to.equal(1);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasOne with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasOne(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'},
            {title: 'Thingies'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[2].id, value: 2}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {

            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    eq: 2
                  }
                }}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].title).to.equal('Thingies');
              done();
            });
          });
        });
      });

    }); //end hasOne

    describe('belongsTo', function() {

      it('should be possible to limit a belongsTo with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasOne(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[1].id, value: 2}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {
            Price.findAndCountAll({
              distinct: true,
              include: [
                {model: Product, where: {
                  title: {
                    eq: 'Sprockets'
                  }
                }}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(1);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].value).to.equal(2);
              done();
            });
          });
        });
      });

      it('should be possible to offset a belongsTo with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              });

        Product.hasOne(Price);
        Price.belongsTo(Product);

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'},
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[2].id, value: 3}
              ]).success(function() {
                callback();
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {

            Price.findAndCountAll({
              distinct: true,
              include: [
                {model: Product, where: {
                  title: {
                    eq: 'Sprockets'
                  }
                }}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].value).to.equal(3);
              done();
            });
          });
        });
      });

    }); //end belongsTo

    describe('hasMany through', function() {

      it('should be possible to limit a hasMany through with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              })
            , ProductsPrices = this.sequelize.define('ProductsPrices', {});

        Product.hasMany(Price, {through: ProductsPrices});
        Price.hasMany(Product, {through: ProductsPrices});

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'},
            {title: 'Thingies'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {value: 1},
                {value: 1.1},
                {value: 1.2},
                {value: 2},
                {value: 2.1}
              ]).success(function() {
                Price.findAll().success(function(prices) {
                  ProductsPrices.bulkCreate([
                    {ProductId: products[0].id, PriceId: prices[0].id},
                    {ProductId: products[0].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[2].id},
                    {ProductId: products[1].id, PriceId: prices[3].id},
                    {ProductId: products[2].id, PriceId: prices[3].id},
                    {ProductId: products[2].id, PriceId: prices[4].id},
                  ]).success(function() {
                    callback();
                  });
                })
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {
            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    gte: 2
                  }
                }}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Sprockets');
              expect(product.prices.length).to.equal(1);
              expect(product.prices[0].value).to.equal(2);
              done();
            });
          });
        });
      });

      it('should be possible to limit a hasMany through with a where', function (done) {

        var Product = this.sequelize.define('Product', {
              title: DataTypes.STRING
            })
            , Price = this.sequelize.define('Price', {
                value: DataTypes.FLOAT
              })
            , ProductsPrices = this.sequelize.define('ProductsPrices', {});

        Product.hasMany(Price, {through: ProductsPrices});
        Price.hasMany(Product, {through: ProductsPrices});

        var setUp = function(callback) {
          Product.bulkCreate([
            {title: 'Widgets'},
            {title: 'Sprockets'},
            {title: 'Thingies'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {value: 1},
                {value: 1.1},
                {value: 1.2},
                {value: 2},
                {value: 2.1}
              ]).success(function() {
                Price.findAll().success(function(prices) {
                  ProductsPrices.bulkCreate([
                    {ProductId: products[0].id, PriceId: prices[0].id},
                    {ProductId: products[0].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[2].id},
                    {ProductId: products[1].id, PriceId: prices[3].id},
                    {ProductId: products[2].id, PriceId: prices[3].id},
                    {ProductId: products[2].id, PriceId: prices[4].id},
                  ]).success(function() {
                    callback();
                  });
                })
              });
            });
          });
        };

        this.sequelize.sync({force: true}).success(function() {
          setUp(function() {
            Product.findAndCountAll({
              distinct: true,
              include: [
                {model: Price, where: {
                  value: {
                    gte: 2
                  }
                }}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Thingies');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(2);
              expect(product.prices[1].value).to.equal(2.1);
              done();
            });
          });
        });
      });

    }); //end hasMany through

  })
})

