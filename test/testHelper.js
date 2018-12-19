var mongoose = require('mongoose');
var testConfig = require('./testConfig');
mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect(testConfig.database, { useNewUrlParser: true });
    mongoose.connection
        .once('open', () => { console.log("Connected to test database successfully."); done(); })
        .on('error', (error) => { console.warn('Error', error); });
});

beforeEach((done) => {
    const { users, products, orders } = mongoose.connection.collections;
    users.drop(() => {
        products.drop(() => {
            orders.drop(() => {
                done();
            });
        });
    });
});