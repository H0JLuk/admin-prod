import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createDropdown, addToolbarToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { Locale } from '@ckeditor/ckeditor5-utils';
import EditPopup from './popup';

export default class SetListValueUI extends Plugin {
    init() {
        const editor = this.editor;

        (editor as any).ui.componentFactory.add('setListValue', (locale: Locale) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const dropDown = createDropdown(locale);
            const popup = new EditPopup(locale);
            const command = editor.commands.get('insertListValue') as any;

            popup.tbName.bind('value').to(command, 'value' as any);
            dropDown.bind('isEnabled').to(command, 'isValidList' as any);

            dropDown.buttonView.set({
                label: 'Начало списка',
                withText: true,
            });

            this.listenTo(dropDown, 'change:isOpen', () => {
                setTimeout(() => popup.tbName.focus());
            });

            this.listenTo(popup, 'submit', () => {
                const startValue = (popup.tbName.element as any).value;
                const selectedListItem = editor.model.document.selection.getFirstPosition()!.parent;

                editor.execute('insertListValue', startValue, selectedListItem);

                dropDown.isOpen = false;
                (popup.tbName.element as any).value = '';
            });

            addToolbarToDropdown(dropDown, [popup as any]);

            return dropDown;
        });
    }
}
