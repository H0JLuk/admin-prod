/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from 'react';

// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import '@ckeditor/ckeditor5-build-classic/build/translations/ru';
// @ts-ignore
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
// @ts-ignore
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
// @ts-ignore
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
// @ts-ignore
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
// @ts-ignore
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
// @ts-ignore
import List from '@ckeditor/ckeditor5-list/src/list.js';
// @ts-ignore
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
// @ts-ignore
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js';
// @ts-ignore
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import SetListValue from './setListValuePlugin/setListValue';

type RichTextEditorProps = {
    value?: string;
    disabled?: boolean;
    onReady?: (...args: any[]) => void;
    onChange?: (...args: any[]) => void;
    onBlur?: (...args: any[]) => void;
    onFocus?: (...args: any[]) => void;
    onError?: (...args: any[]) => void;
};

const editorConfiguration = {
    plugins: [
        Essentials,
        Bold,
        Italic,
        Paragraph,
        Subscript,
        Superscript,
        FontBackgroundColor,
        FontColor,
        Heading,
        List,
        ListStyle,
        TextTransformation,
        SetListValue,
    ],
    toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'bulletedList',
        'numberedList',
        'superscript',
        'subscript',
        'fontBackgroundColor',
        'fontColor',
        '|',
        'undo',
        'redo',
        '|',
        'setListValue',
    ],
    typing: {
        transformations: {
            remove: [
                // Do not use the transformations from the
                // 'symbols' and 'quotes' groups.
                'symbols',
                'quotes',

                // As well as the following transformations.
                'arrowLeft',
                'arrowRight',
            ],
        },
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
        ]
    },
    language: 'ru',
};

const InternalRichTextEditor: React.ForwardRefRenderFunction<unknown, RichTextEditorProps> = ({
    value,
    disabled,
    onReady,
    onChange,
    onBlur,
    onFocus,
    onError,
}, ref) => {
    /* CKEditor should no change data prop */
    const data = useRef(value);
    return (
        <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={data.current}
            disabled={disabled}
            onReady={onReady}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onError={onError}
            ref={ref}
        />
    );
};

const RichTextEditor = React.forwardRef<unknown, RichTextEditorProps>(InternalRichTextEditor);

export default RichTextEditor;
