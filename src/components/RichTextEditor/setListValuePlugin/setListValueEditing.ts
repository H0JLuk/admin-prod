import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertListValueCommand from './insertListValueCommand';
import first from '@ckeditor/ckeditor5-utils/src/first';

export default class SetListValueEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;

        editor.model.schema.extend('listItem', { allowAttributes: 'value' });
        editor.conversion.attributeToAttribute({
            model: 'value',
            view: 'value',
        });

        this.editor.commands.add(
            'insertListValue',
            new InsertListValueCommand(this.editor),
        );

        editor.commands.get('enter')!.on('afterExecute', () => {
            const block = first(editor.model.document.selection.getSelectedBlocks());
            if (block.name === 'listItem' && block.hasAttribute('value')) {
                editor.model.change(writer => {
                    writer.removeAttribute('value', block);
                });
            }
        });
    }
}
