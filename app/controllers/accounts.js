'use strict';


const Boom = require('boom');
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');   // ADDED to hash passwords
const saltRounds = 10;      // Speed parameter for salting

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Points of Interest' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Points of Interest' });
        }
    },
    signup: {
        auth: false,
        validate: {
            // payload: {
            //     firstName: Joi.string().required(),
            //     lastName: Joi.string().required(),
            //     email: Joi.string()
            //       .email()
            //       .required(),
            //     password: Joi.string().required()
            // },
            payload: {
                firstName: Joi.string().required().regex(/^[a-zA-Z0-9]*$/).min(3),
                  // .regex(/^[A-Z][a-z]{2,}$/),
                lastName: Joi.string().required().regex(/^[a-zA-Z0-9]*$/).min(3),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required().min(5)},

            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);

            }
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw new Boom(message);
                }

                const hash = await bcrypt.hash(payload.password, saltRounds);
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: hash,
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });

                return h.redirect('/home');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Points Of Interest' });
        }
    },
    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string()
                  .email()
                  .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                  .view('login', {
                      title: 'Sign in error',
                      errors: error.details
                  })
                  .takeover()
                  .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw new Boom(message);
                }


                if (!await user.comparePassword(password)) {         // EDITED (next few lines)
                    const message = 'Password mismatch';
                    throw new Boom(message);
                } else {
                    request.cookieAuth.set({ id: user.id });
                    return h.redirect('/home');
                }
            }
            catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    //             user.comparePassword(password);
    //             request.cookieAuth.set({ id: user.id });
    //             return h.redirect('/home');
    //         } catch (err) {
    //             return h.view('login', { errors: [{ message: err.message }] });
    //         }
    //     }
    // },
    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                return h.view('settings', { title: 'POI Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    //function for the user to update settings
    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Update settings error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                //declares the input from the user as the userEdit..
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const hash = await bcrypt.hash(userEdit.password, saltRounds);
                //..then updates the names
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = hash;
                await user.save();
                return h.redirect('/home');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },

    options: {
        abortEarly:false,
    },

    logout: {
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    }
};

module.exports = Accounts;
