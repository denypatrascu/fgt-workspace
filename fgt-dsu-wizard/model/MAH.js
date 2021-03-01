const Actor = require('./Actor');

class MAH extends Actor{

    constructor(mah) {
        super();
        if (typeof mah !== undefined)
            for (let prop in mah)
                if (mah.hasOwnProperty(prop))
                    this[prop] = mah[prop];
    }
}

module.exports = MAH;