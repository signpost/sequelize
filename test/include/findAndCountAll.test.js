/* jshint camelcase: false */
/* jshint expr: true */
var chai      = require('chai')
  , expect    = chai.expect
  , Support   = require(__dirname + '/../support')
  , DataTypes = require(__dirname + "/../../lib/data-types")
  , datetime  = require('chai-datetime')
  , Sequelize = require('../..')

chai.use(datetime)
chai.config.includeStack = true

describe(Support.getTestDialectTeaser("Include"), function () {
  describe('findAndCountAll', function () {

    describe('hasMany', function() {

      it('should be possible to limit a hasMany', function (done) {

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
                {model: Price}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Widgets');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(1);
              expect(product.prices[1].value).to.equal(1.5);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasMany', function (done) {

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
                {ProductId: products[0].id, value: 1.1},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[1].id, value: 2.1},
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
                {model: Price}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Sprockets');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(2);
              expect(product.prices[1].value).to.equal(2.1);
              done();
            });
          });
        });
      });

    }); //end hasMany

    describe('hasOne', function() {

      it('should be possible to limit a hasOne', function (done) {

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
                {model: Price}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].title).to.equal('Widgets')
              expect(results.rows[0].price.value).to.equal(1)
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasOne', function (done) {

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
                {ProductId: products[1].id, value: 2},
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
                {model: Price}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].title).to.equal('Sprockets');
              expect(results.rows[0].price.value).to.equal(2);
              done();
            });
          });
        });
      });

    }); //end hasOne

    describe('belongsTo', function() {

      it('should be possible to limit a belongsTo', function (done) {

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
                {model: Product}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].value).to.equal(1);
              expect(results.rows[0].product.title).to.equal('Widgets');
              done();
            });
          });
        });
      });

      it('should be possible to offset a belongsTo', function (done) {

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
                {model: Product}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              expect(results.rows[0].value).to.equal(2);
              expect(results.rows[0].product.title).to.equal('Sprockets');
              done();
            });
          });
        });
      });

    }); //end belongsTo

    describe('hasMany through', function() {

      it('should be possible to limit a hasMany through', function (done) {

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
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {value: 1},
                {value: 2},
                {value: 3}
              ]).success(function() {
                Price.findAll().success(function(prices) {
                  ProductsPrices.bulkCreate([
                    {ProductId: products[0].id, PriceId: prices[0].id},
                    {ProductId: products[0].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[2].id}
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
                {model: Price}
              ],
              limit: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Widgets');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(1);
              expect(product.prices[1].value).to.equal(2);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasMany through', function (done) {

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
            {title: 'Sprockets'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {value: 1},
                {value: 2},
                {value: 3}
              ]).success(function() {
                Price.findAll().success(function(prices) {
                  ProductsPrices.bulkCreate([
                    {ProductId: products[0].id, PriceId: prices[0].id},
                    {ProductId: products[0].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[2].id}
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
                {model: Price}
              ],
              offset: 1
            // }).on('sql', function(sql) {
            //   console.log(sql);
            }).success(function (results) {
              expect(results.count).to.equal(2);
              expect(results.rows.length).to.equal(1);
              var product = results.rows[0];
              expect(product.title).to.equal('Sprockets');
              expect(product.prices.length).to.equal(2);
              expect(product.prices[0].value).to.equal(2);
              expect(product.prices[1].value).to.equal(3);
              done();
            });
          });
        });
      });

    }); //end hasMany through

    describe('hasMany where', function() {

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

    }); //end hasMany where

    describe('hasOne where', function() {

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

    }); //end hasOne where

    describe('belongsTo where', function() {

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
              expect(results.rows[0].product.title).to.equal('Sprockets');
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
              expect(results.rows[0].product.title).to.equal('Sprockets');
              done();
            });
          });
        });
      });

    }); //end belongsTo where

    describe('hasMany through where', function() {

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

      it('should be possible to offset a hasMany through with a where', function (done) {

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

    }); //end hasMany through where

    describe('hasMany exclude where', function() {

      it('should be possible to combine boolean where and hasMany exclude where', function (done) {

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
            {title: 'Widgets A'},
            {title: 'Widgets B'},
            {title: 'Sprockets A'},
            {title: 'Sprockets B'},
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[0].id, value: 1.5},
                {ProductId: products[1].id, value: 1},
                {ProductId: products[1].id, value: 1.5},
                {ProductId: products[2].id, value: 2},
                {ProductId: products[2].id, value: 2.5},
                {ProductId: products[3].id, value: 2},
                {ProductId: products[3].id, value: 2.5}
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
              where: Sequelize.and([{
                title: {
                  like: '%B'
                }
              }]),
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.title).to.equal('Sprockets B');
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to limit a hasMany exclude with a where', function (done) {

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
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.prices).to.equal(undefined);
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
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

    }); //end hasMany exclude where

    describe('hasOne exclude where', function() {

      it('should be possible to combine boolean where and hasOne exclude where', function (done) {

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
            {title: 'Widgets A'},
            {title: 'Widgets B'},
            {title: 'Sprockets A'},
            {title: 'Sprockets B'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {ProductId: products[0].id, value: 1},
                {ProductId: products[1].id, value: 1},
                {ProductId: products[2].id, value: 2},
                {ProductId: products[3].id, value: 2}
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
              where: Sequelize.and([{
                title: {
                  like: '%B'
                }
              }]),
              exclude: [
                {model: Price, where: {
                  value: {
                    eq: 1
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
              expect(product.title).to.equal('Sprockets B');
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to limit a hasOne exclude with a where', function (done) {

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
              exclude: [
                {model: Price, where: {
                  value: {
                    eq: 1
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
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasOne exclude with a where', function (done) {

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
              exclude: [
                {model: Price, where: {
                  value: {
                    eq: 1
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
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

    }); //end hasOne exclude where

    describe('belongsTo exclude where', function() {

      it('should be possible to combine boolean where with belongsTo where', function (done) {

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
                {ProductId: products[0].id, value: 1.1},
                {ProductId: products[1].id, value: 2},
                {ProductId: products[1].id, value: 2.1}
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
              where: Sequelize.and([{
                value: {
                  lte: 2
                }
              }]),
              exclude: [
                {model: Product, where: {
                  title: {
                    eq: 'Widgets'
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
              expect(results.rows[0].product).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to limit a belongsTo exclude with a where', function (done) {

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
              exclude: [
                {model: Product, where: {
                  title: {
                    eq: 'Widgets'
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
              expect(results.rows[0].product).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to offset a belongsTo exclude with a where', function (done) {

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
              exclude: [
                {model: Product, where: {
                  title: {
                    eq: 'Widgets'
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
              expect(results.rows[0].product).to.equal(undefined);
              done();
            });
          });
        });
      });

    }); //end belongsTo exclude where

    describe('hasMany through exclude where', function() {

      it('should be possible to combine boolean where and hasMany through exclude where', function (done) {

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
            {title: 'Widgets A'},
            {title: 'Widgets B'},
            {title: 'Sprockets A'},
            {title: 'Sprockets B'},
            {title: 'Thingies A'},
            {title: 'Thingies B'}
          ]).success(function() {
            Product.findAll().success(function(products) {
              Price.bulkCreate([
                {value: 1},
                {value: 1.1},
                {value: 2},
                {value: 2.1},
                {value: 2.2}
              ]).success(function() {
                Price.findAll().success(function(prices) {
                  ProductsPrices.bulkCreate([
                    {ProductId: products[0].id, PriceId: prices[0].id},
                    {ProductId: products[0].id, PriceId: prices[1].id},
                    {ProductId: products[1].id, PriceId: prices[0].id},
                    {ProductId: products[1].id, PriceId: prices[1].id},
                    {ProductId: products[2].id, PriceId: prices[2].id},
                    {ProductId: products[2].id, PriceId: prices[3].id},
                    {ProductId: products[3].id, PriceId: prices[2].id},
                    {ProductId: products[3].id, PriceId: prices[3].id},
                    {ProductId: products[4].id, PriceId: prices[3].id},
                    {ProductId: products[4].id, PriceId: prices[4].id},
                    {ProductId: products[5].id, PriceId: prices[3].id},
                    {ProductId: products[5].id, PriceId: prices[4].id},
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
              where: Sequelize.and([{
                title: {
                  like: '%B'
                }
              }]),
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.title).to.equal('Sprockets B');
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to limit a hasMany through exclude with a where', function (done) {

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
                {value: 2},
                {value: 2.1},
                {value: 2.2}
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
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

      it('should be possible to offset a hasMany through exclude with a where', function (done) {

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
                {value: 2},
                {value: 2.1},
                {value: 2.2}
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
              exclude: [
                {model: Price, where: {
                  value: {
                    lt: 2
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
              expect(product.prices).to.equal(undefined);
              done();
            });
          });
        });
      });

    }); //end hasMany through exclude where

  })
});

