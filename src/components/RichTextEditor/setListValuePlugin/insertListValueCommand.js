import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';

export default class InsertListValueCommand extends Command {
    constructor(editor) {
        super(editor);
        this.set('isValidList');
    }

    execute(startValue) {
        const model = this.editor.model;
        const block = first(model.document.selection.getSelectedBlocks());

        model.change((writer) => {
            if (isNaN(+startValue)) {
                writer.removeAttribute('value', block);
            } else {
                writer.setAttribute('value', startValue, block);
            }
        });
    }

    refresh() {
        this.isEnabled = true;

        const allowedStyles = ['decimal-leading-zero', 'default', 'decimal'];
        const selectedListItem = this.editor.model.document.selection.getFirstPosition().parent;
        const isItemValid = selectedListItem.name === 'listItem' && allowedStyles.includes(selectedListItem._attrs.get('listStyle')) ;

        this.isValidList = isItemValid;
    }
}