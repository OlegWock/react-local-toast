'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./react-local-toast.cjs.production.js');
} else {
    module.exports = require('./react-local-toast.cjs.development.js');
}
