/**
 * Meant to be used as a service, to get an App's seed via it's name
 * @module services
 * @deprecated
 */

/**
 *
 * @type {string}
 */
const path_to_workspace = "."

/**
 * To work, this function needs to be configured in APIHub's server.json file
 * @param {HttpServer} server
 * @deprecated
 */
function startStoreService(server){
    const fs = require('fs');
    const path = require('path');
    server.get(`/:domain/dsustore/get-ssi/:name`, (req, res, next) => {
        const {domain, name} = req.params;
        fs.readFile(path.join(path_to_workspace, name, "seed"), (err, data) => {
            if (err)
                return res.send(404, "Could not find App");
            let keySSI = require('keyssi').parse(data.toString());
            if (keySSI.getDLDomain() !== domain)
                return res.send(503, `Invalid domain ${domain}`);
            return res.send(200, data.toString());
        });
    });
}

module.exports = startStoreService;
