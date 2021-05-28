import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createDropdown, addToolbarToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import EditPopup from './popup';

export default class SetListValueUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('setListValue', (locale) => {
            const dropDown = createDropdown(locale);
            const popup = new EditPopup(locale);
            const command = editor.commands.get('insertListValue');

            popup.tbName.bind('value').to(command, 'value');
            dropDown.bind('isEnabled').to(command, 'isValidList');

            dropDown.buttonView.set({
                label: 'Начало списка',
                withText: true,
            });

            this.listenTo(dropDown, 'change:isOpen', () => {
                setTimeout(() => popup.tbName.focus());
            });

            this.listenTo(popup, 'submit', () => {
                const startValue = popup.tbName.element.value;
                const selectedListItem = editor.model.document.selection.getFirstPosition().parent;

                editor.execute('insertListValue', startValue, selectedListItem);

                dropDown.isOpen = false;
                popup.tbName.element.value = '';
            });

            addToolbarToDropdown(dropDown, [popup]);

            return dropDown;
        });
    }
}
