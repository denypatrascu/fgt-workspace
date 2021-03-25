import WalletRunner from "./services/WalletRunner.js";
import env from "../../environment.js"

const AppBuilderService = require('toolkit').Services.AppBuilderService;
const LocalizedController = require('toolkit').Controllers.LocalizedController;

const generateTranslation = function (){
    return {
        en:{
            "/": {
                "title": "Finished Goods Traceability - Wholesalers",
                "welcome": "Welcome back",
                "errors": {
                    "register": "Unable to register",
                    "login": "Try Again?"
                },
                "success": {
                    "registration": "Registration successful. Please Login",
                    "login": "Login successful. Loading..."
                },
                "none": "You are not identified as a Marketing Authorization holder. Please register",
                "form": {
                    "title": "Please enter your credentials",
                    "formError": "",
                    "name": {
                        "label": "Registered Wholesaler's name:",
                        "type": "text",
                        "placeholder": "Please enter your name here...",
                        "value": "PDM the Wholesaler",
                        "public": true,
                        "required": true
                    },
                    "id": {
                        "label": "Registered Id:",
                        "type": "text",
                        "placeholder": "Please enter your id here...",
                        "value": "#ThIsIsAwHoLeSaLeRiD=",
                        "public": true,
                        "required": true
                    },
                    "email": {
                        "label": "Registered Email:",
                        "type": "email",
                        "placeholder": "Please enter your email here...",
                        "value": "wholesaler@pdmfc.com",
                        "public": true,
                        "required": true
                    },
                    "tin": {
                        "label": "Registered TIN (Tax Identification Number):",
                        "type": "number",
                        "placeholder": "Enter your TIN (Tax Identification Number)...",
                        "value": 500000000,
                        "public": true,
                        "required": true
                    },
                    "address": {
                        "label": "Registered Address:",
                        "type": "text",
                        "placeholder": "Enter your address...",
                        "required": true,
                        "value": "This in an Address"
                    },
                    "buttons": {
                        "login": "Login",
                        "register": "Register"
                    }
                }
            }
        }
    }
}


export default class HomeController extends LocalizedController {
    getModel = () => ({
        participant: undefined
    });

    constructor(element, history) {
        super(element, history);
        console.log(`The translation model in the Home controller is: ${WebCardinal.translations.en}`);
        if (!WebCardinal.translations.en){
            console.log("THE TRANSLATION MODEL IS NOT SET! - Hardcoding...");
            WebCardinal.translations = generateTranslation();
        }
        super.bindLocale(this, "");
        this.setModel(this.getModel());

        let self = this;
        this.on('perform-registration', async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            await self.register(event.detail, (err) => {
                if (err)
                    self.showErrorModal();
                self.hideModal();
                self._testParticipant();
            });
        }, true)

        //this.walletService = new WalletService();
        this.appService = new AppBuilderService(env);
        this.on('perform-login', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            self.login(event.detail, (err) => {
                if (err)
                    self.model.form.formError = err;
            });
        }, true)


        console.log("Home controller initialized");
        this._showLoginModal();
    }

    _getLoader(message, duration){
        duration = duration || 0;
        const loading = document.createElement('ion-loading');
        loading.cssClass = 'ion-loading';
        loading.message = message;
        loading.translucent = true;
        loading.duration = duration;
        document.body.appendChild(loading);
        return loading;
    }

    /**
     * Creates the ID DSU and mounts it to the id_path
     * @param {object} credentials
     * @param {function} callback
     */
    async register(credentials, callback){
        let self = this;
        let loader = self._getLoader("Registering...");
        await loader.present();

        self.appService.buildWallet(credentials, async (err, keySSI) => {
            if (err)
                self.showErrorToast(err);
            else
                self.showToast(self.translate('success.register'));
            await loader.dismiss();
        })
    }

    /**
     * Loads the SSApp
     * @param {object} credentials
     * @param {function} callback
     */
    async login(credentials, callback){
        let self = this;
        let loader = this._getLoader("Logging in...");
        await loader.present();
        this.walletService.load('traceability', credentials, env.vault, async (err, wallet) => {
           if (err){
               self.showErrorToast(err);
               return callback(err);
           }
           self.showToast(self.translate('success.login'));

           wallet.getKeySSIAsString(async (err, keySSI) => {
               if (err)
                   return callback(err);

               console.log(`Loading wallet ${keySSI}`);

               await loader.dismiss();
               new WalletRunner({
                   seed: keySSI,
                   spinner: loader
               }).run();
           })
        });
    }

    _showLoginModal() {
        // this.showIonicModal("a-generic-configurable-modal", false, {page: "registration"});
        this.createWebcModal({
            modelTitle: "",
            modalName: 'genericModal',
            showFooter: false,
            canClose: false,
            showCancelButton: false
        });
    }
}