import View from '@ckeditor/ckeditor5-ui/src/view';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';

export default class EditPopup extends View {
    constructor(locale) {
        super(locale);

        this.tbName = new InputTextView(locale);
        this.tbName.set({
            placeholder: 'Введите число',
        });

        this.tbName.extendTemplate({
            attributes: {
                class: ['ck-bookmark-edit-tbName'],
            },
        });

        this.saveButtonView = this._createButton(
            locale.t('Сохранить'),
            checkIcon,
            'ck-bookmark-edit-btnSave'
        );

        this.saveButtonView.type = 'submit';

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck-bookmark-edit'],
                tabindex: '-1',
            },

            children: [
                this.tbName,
                this.saveButtonView,
            ],
        });
    }

    render() {
        super.render();

        submitHandler({
            view: this,
        });
    }

    _createButton(label, icon, className, eventName) {
        const button = new ButtonView(this.locale);

        button.set({
            label,
            icon,
            tooltip: true,
        });

        button.extendTemplate({
            attributes: {
                class: [className],
            },
        });

        if (eventName) {
            button.delegate('execute').to(this, eventName);
        }

        return button;
    }
}
