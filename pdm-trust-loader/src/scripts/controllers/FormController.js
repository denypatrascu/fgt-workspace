/**
 * @module controllers
 */

/**
 *
 */
import LocalizedController from './LocalizedController.js'

/**
 * @class FormController
 */
export default class FormController extends LocalizedController {

    getModel = () => ({});

    constructor(element, history) {
        // this.element or element in constructor is webc-modal for FromController
        super(element, history);

        let self = this;
        super.bindLocale(self, `.form`, true);

        // getting translations for this Controller
        const formModel = self.translationModel.form;

        // or using translate function
        // const fromModel = this.translate('form');

        self.setModel({
            title: formModel.title,
            buttons: formModel.buttons
        });

        // creates the modal
        self._createModalForm(formModel);

        console.log("FormController initialized");

        Object.entries(formModel.buttons).forEach(b => {
            self.onTagClick(`try-${b[0]}`, self._handleTry(`${b[0]}`).bind(self));
        });

        self.on('input-has-changed', self._handleErrorElement.bind(self));
    }

    _handleTry(name) {
        return function() {
            if (this.hasErrors())
                return this.showErrorToast('There are errors in the form');
            switch (name){
                case 'register':
                    return this._submitRegistration();
                case 'login':
                    return this._submitLogin();
            }
        }
    }

    _createModalForm(model){
        // create inputs from model objects
        const fields = Object.entries(model)
            .map(e => ({name: e[0], attributes: e[1]}))
            .filter(e => typeof e.attributes === 'object');
        const inputs = fields.filter(f => f.name !== 'buttons');
        this._defineElements(inputs);
    }

    _handleErrorElement(evt){
        let name = evt.detail;
        let attributes = this.model.toObject()[name];
        let errorEl = this.element.querySelector(`ion-note[name="note-${name}"]`);
        if (attributes.error){
            if (errorEl){
                errorEl.innerHTML = attributes.error;
            } else {
                errorEl = document.createElement('ion-note');
                errorEl.setAttribute('position', 'stacked');
                errorEl.setAttribute('slot', 'end');
                errorEl.setAttribute('color', 'danger');
                errorEl.setAttribute('name', `note-${name}`)
                errorEl.innerHTML = attributes.error;
                let htmlEl = this.element.querySelector(`ion-item ion-input[name="input-${name}"]`);
                htmlEl.insertAdjacentElement('afterend', errorEl);
            }
        } else if (errorEl) {
            errorEl.remove();
        }
    }

    _defineElements(inputs){
        const contentElement = this.querySelector('div.modal-content');

        inputs.forEach(input => {
            const elName = this._defineIonInput(input.name, input.attributes);
            const element = document.createElement(elName);
            contentElement.append(element);
        });
    }

    /**
     *
     * @param {string} name read from model containing the fields attributes
     * @param {object} attributes
     * @private
     */
    _defineIonInput(name, attributes){
        const el_name = `loader-input-${name}`;
        customElements.define(el_name, class extends HTMLElement{
            connectedCallback(){
                this.innerHTML = `
    <ion-item>
        <ion-label position="stacked">${attributes.label}</ion-label>
        <ion-input name="input-${name}" data-model="@${name}" 
            ${['number', 'date'].indexOf(attributes.type) !== -1 ? `inputmode="${attributes.type}"` : `inputmode="text"`} 
            ${attributes.max ? `max="${attributes.max}"` : ""} 
            ${attributes.min ? `min="${attributes.min}"` : ""} 
            ${attributes["max-length"] ? `max-length="${attributes['max-length']}"` : ""} 
            ${attributes["min-length"] ? `min-length="${attributes['min-length']}"` : ""}  
            type="${attributes.type}" required="${attributes.required}" clear-on-edit="true" value="${attributes.value}"></ion-input>
    </ion-item>`
            }
        });
        return el_name;
    }

    _getColor(index){
        switch (index) {
            case 1: return "primary"
            case 2: return "secondary"
            default: return "tertiary"
        }
    }

    _submitRegistration = function () {
        let participant = this._toSecrets();
        this.send('perform-registration', participant);
    }

    _submitLogin = function () {
        let secrets = this._toSecrets();
        this.send('perform-login', secrets);
    }

    _toSecrets = function (model) {
        model = model || this.model
        let result = {};
        Object.entries(model.toObject())
            .filter(k => !!k[1].value).forEach(e => {
                result[e[0]] = {
                    secret: e[1].value,
                    "public": !!e[1].public
                };
            })
        return result;
    }
}