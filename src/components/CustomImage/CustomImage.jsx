import Image from '@tiptap/extension-image';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

// A small React component to render the caption input inside the editor
const Caption = ({ node, updateAttributes }) => (
    <figcaption contentEditable suppressContentEditableWarning={true} onBlur={e => updateAttributes({ caption: e.target.textContent })}>
        {node.attrs.caption || 'Type a caption...'}
    </figcaption>
);

// The component that will render our image with its figure and caption
const ImageView = ({ node, updateAttributes, editor }) => {
    const { src, alt, title, 'data-align': align, caption } = node.attrs;

    return (
        <figure
            data-align={align}
            className={`image-figure ${align ? `align-${align}` : ''}`}
            style={{ float: align === 'center' ? 'none' : align }}
        >
            <img src={src} alt={alt} title={title} className="rounded-lg shadow-md" />
            {editor.isEditable && ( // Only show the caption input when editing
                <Caption node={node} updateAttributes={updateAttributes} />
            )}
        </figure>
    );
};

export const CustomImage = Image.extend({
    // Extend the attributes to include our custom ones
    addAttributes() {
        return {
            ...this.parent?.(),
            'data-align': {
                default: 'center', // Default to center alignment
            },
            caption: {
                default: null,
            },
            style: {
                default: null, // Allow inline styles for float
            }
        };
    },

    // This tells Tiptap to render the image using our custom React component
    addNodeView() {
        return ReactNodeViewRenderer(ImageView);
    },
});

export default CustomImage;