var assert = require('assert');
var user = require('../model/user');

/**
 * Tests the user class.
 */
describe('User Class Tests', () => {

    /**
     * Creates an user in the test database.
     */
    it('creates an user', (done) => {
        var john = new user({ firstname: 'John', lastname: 'Doe', email: 'email1@email.com', password: 'whoknows' });

        john.save()
            .then(() => { assert(!john.isNew); done(); })
            .catch((err) => { assert.fail(err); });

    });

    /**
     * Creates three global users before each 
     * test in the database.
     */
    let john, joe, dan;

    beforeEach((done) => {
        john = new user({ firstname: 'John', lastname: 'Doe', email: 'email1@email.com', password: 'whoknows' });
        joe = new user({ firstname: 'Joe', lastname: 'Doe', email: 'email2@email.com', password: 'whoknows' });
        dan = new user({ firstname: 'Dan', lastname: 'Doe', email: 'email3@email.com', password: 'whoknows' });

        Promise.all([john.save(), joe.save(), dan.save()])
            .then(() => done());
    });

    /**
     * Finds an user by email.
     */
    it('finds an user by email', (done) => {
        user.findOne({ email: 'email1@email.com' })
            .then((user) => {
                assert(user.email == john.email);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds an user by id.
     */
    it('finds an user by id', (done) => {
        user.findOne({ _id: dan._id })
            .then((user) => {
                assert(user.firstname == dan.firstname);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Finds all the users.
     */
    it('finds all the users', (done) => {
        user.find()
            .then((users) => {
                assert(users.length == 3);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });

    /**
     * Removes an user by id
     */
    it('removes an user', (done) => {
        user.deleteOne({ _id: joe._id })
            .then(() => user.findOne({ email: joe.email }))
            .then((user) => {
                assert(user == null);
                done();
            })
            .catch((err) => { assert.fail(err); });
    });
});

