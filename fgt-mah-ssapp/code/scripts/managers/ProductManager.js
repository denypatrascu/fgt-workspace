import {getBatchManager} from "./BatchManager.js";
const Manager = require('wizard').Managers.Manager;

const PRODUCT_MOUNT_PATH = "/products";
const BATCH_MOUNT_PATH = "/batches";
const Product = require('wizard').Model.Product;

/**
 * Product Manager Class
 *
 * Manager Classes in this context should do the bridge between the controllers
 * and the services exposing only the necessary api to the controllers while encapsulating <strong>all</strong> business logic.
 *
 * All Manager Classes should be singletons.
 *
 * This complete separation of concerts is very beneficial for 2 reasons:
 * <ul>
 *     <li>Allows for testing since there's no browser dependent code (i think) since the DSUStorage can be 'mocked'</li>
 *     <li>Allows for different controllers access different business logic when necessary (while benefiting from the singleton behaviour)</li>
 * </ul>
 *
 * @param {DSUStorage} dsuStorage the controllers dsu storage
 */
class ProductManager extends Manager{
    constructor(dsuStorage) {
        super(dsuStorage);
        this.productService = new (require('wizard').Services.ProductService)("traceability");
        this.batchManager = getBatchManager(this.DSUStorage);
    }

    /**
     * Returns the mount path for a given gtin
     * @private
     */
    _getMountPath(gtin){
        return `${PRODUCT_MOUNT_PATH}/${gtin}`;
    }

    /**
     * Creates a {@link Product} dsu
     * @param {Product} product
     * @param {function(err, keySSI, string)} callback where the string is the mount path relative to the main DSU
     */
    create(product, callback) {
        let self = this;
        super.initialize(() => {
            self.productService.create(product, (err, keySSI) => {
                if (err)
                    return callback(err);
                let mount_path = this._getMountPath(product.gtin);
                self.DSUStorage.mount(mount_path, keySSI.getIdentifier(), (err) => {
                    if (err)
                        return callback(err);
                    console.log(`Product ${product.gtin} created and mounted at '${mount_path}'`);
                    callback(undefined, keySSI, mount_path);
                });
            });
        });
    }

    /**
     * reads the product information (the /info path) from a given gtin (if exists and is registered to the mah)
     * @param {string} gtin
     * @param {function(err, Product)} callback
     */
    getOne(gtin, callback){
        this.DSUStorage.getObject(`${this._getMountPath(gtin)}/info`, (err, product) => {
            if (err)
                return callback(err);
            callback(undefined, product);
        });
    }

    /**
     * Removes a product from the list (does not delete/invalidate DSU, simply 'forgets' the reference)
     * @param {string} gtin
     * @param {function(err)} callback
     */
    removeProduct(gtin, callback) {
        let self = this;
        super.initialize(() => {
            let mount_path = this._getMountPath(gtin);
            self.DSUStorage.unmount(mount_path, (err) => {
                if (err)
                    return callback(err);
                console.log(`Product ${gtin} removed from mount point ${mount_path}`);
                callback();
            });
        });
    }

    /**
     * Edits/Overwrites the product details
     * @param {string} gtin
     * @param {function(err)} callback
     */
    editProduct(gtin, callback) {
        let self = this;
        super.initialize(() => {
            let mount_path = this._getMountPath(gtin);
            self.DSUStorage.writeFile(`${mount_path}/info`, (err) => {
                if (err)
                    return callback(err);
                console.log(`Product ${gtin} updated`);
                callback();
            });
        });
    }

    addBatch(gtin, batch, callback){
        let self = this;
        self.batchManager.create(gtin, batch, (err, keySSI) => {
            if (err)
                return callback(err);
            self.DSUStorage.mount(`${PRODUCT_MOUNT_PATH}/${gtin}${BATCH_MOUNT_PATH}/${batch.batchNumber}`, keySSI, (err, mount) => {
                if (err)
                    return callback(err);
                console.log(`Batch ${batch.batchNumber} mounted at '${mount}'`);
                callback(undefined, keySSI, mount);
            });
        });
    }

    /**
     * Lists all registered products
     * @param {function(err, Product[])} callback
     */
    listProducts(callback) {
        super.listMounts(PRODUCT_MOUNT_PATH, (err, mounts) => {
            if (err)
                return callback(err);
            console.log(`Found ${mounts.length} products at ${PRODUCT_MOUNT_PATH}`);
            mounts = mounts.map(m => {
                m.gtin = m.path;
                m.path = `${PRODUCT_MOUNT_PATH}/${m.path}`;
                return m;
            })
            super.readAll(mounts, callback);
        });
    }

    /**
     *
     * @param model
     * @returns {Product}
     */
    fromModel(model){
        return new Product({
            gtin: model.gtin.value,
            name: model.name.value,
            description: model.description.value,
            manufName: model.manufName.value
        });
    }
}

let productManager;
/**
 * @param {DSUStorage} dsuStorage
 * @returns {ProductManager}
 */
const getProductManager = function (dsuStorage) {
    if (!productManager) {
        if (!dsuStorage)
            throw new Error("No DSUStorage provided");
        productManager = new ProductManager(dsuStorage);
    }
    return productManager;
}

export {
    getProductManager,
    PRODUCT_MOUNT_PATH,
    BATCH_MOUNT_PATH
}