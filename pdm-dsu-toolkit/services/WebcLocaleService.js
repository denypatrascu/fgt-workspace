/**
 * @module locale
 */

/**
 * This service depends on WebCardinal's translation API
 *
 * Integrates with {@link WebCardinal}'s translation model, and natively integrates into controllers and their model
 */
function LocaleService(){
    if (!WebCardinal)
        throw new Error("Could not find WebCardinal");

    const supported = [];

    const getLocale = () => WebCardinal.language;

    const setLocale = (locale) => {
        if (!(locale in supported))
            throw new Error("Provided locale not supported");
        WebCardinal.language = locale;
        this.loadLocale();
    }

    const _genSupported = () => {
        Object.keys(WebCardinal.translations).forEach(a => {
            supported.push(a);
        })
    };

    _genSupported();

    /**
     * Loads the current locale
     */
    this._loadLocale = function(){
        return WebCardinal.translations[getLocale()];
    }

    /**
     * Retrieves the translation information from WebCardinal
     * @param {string} pageName if contains '.' it will be translated into hierarchy in json object (just one level currently supported)
     * @returns {object} the translation object for the provided page in the current language
     */
    this.getByPage = function(pageName){
        let locale = this._loadLocale();
        if (!locale){
            console.log("no locale set");
            return {};
        }

        if (pageName[0] !== "/")
            pageName = "/" + pageName;
        if (pageName.includes(".")){
            let temp = pageName.split(".");
            return locale[temp[0]][temp[1]];
        }
        return locale[pageName];
    }
}

/**
 * Util function to merge JSON objects according to a specified priority
 */
const merge = function(target, source){
    for (const key of Object.keys(source))
        if (source[key] instanceof Object)
            Object.assign(source[key], merge(target[key] ? target[key] : {}, source[key]))
    Object.assign(target || {}, source)
    return target;
}

/**
 * Binds the translation model to the controller and its setModel method
 */
const bindToController = function(controller, page){
    if (!controller.localized) {
        let getter = controller.getModel;
        controller.getModel = () => {
            let locale = localeService.getByPage(page);
            if (!locale){
                console.log(`No translations found for page ${page}`);
                return getter();
            }
            locale = JSON.parse(JSON.stringify(locale));
            let model = getter();
            return merge(locale, model);
        };
        controller.localized = true;
    }
}

let localeService;

module.exports = {
    /**
     * Returns the instance of the LocaleService and binds the locale info to the controller via {@link bindToController}
     * @param {WebcController} controller: the current controller
     * @param {string} page: the name of the view. Must match an existing key in {@link WebCardinal#translations}
     * @returns {LocaleService}
     */
    bindToLocale: function (controller, page){
        if (!localeService)
            localeService = new LocaleService();
        bindToController(controller, page);
        return localeService;
    }
}