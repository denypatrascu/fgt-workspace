/**
 * @module dt
 */

/**
 * Provides a Environment Independent and Versatile Dossier Building API.
 *
 * Meant to be integrated into OpenDSU
 */

/**
 * Returns a DossierBuilder Instance
 * @param {Archive} [sourceDSU] should only be provided when cloning a DSU
 * @return {DossierBuilder}
 */
const getDossierBuilder = (sourceDSU) => {
    return new (require("./DossierBuilder").DossierBuilder)(sourceDSU)
}

module.exports = {
    getDossierBuilder,
    Operations: require("./DossierBuilder").OPERATIONS,
    AppBuilderService: require('./AppBuilderService')
}
