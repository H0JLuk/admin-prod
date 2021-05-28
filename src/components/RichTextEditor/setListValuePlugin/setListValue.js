import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SetListValueUI from './setListValueUI';
import SetListValueEditing from './setListValueEditing';

export default class SetListValue extends Plugin {
    static get requires() {
        return [SetListValueEditing, SetListValueUI];
    }
}
