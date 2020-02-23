export default () => {
    async function buildTypeStyles(styles) {
        const currentSelection = figma.currentPage.selection;
        styles.forEach(async (textyle, idx) => {
            await figma.loadFontAsync(textyle.fontName);
            const newStyle = figma.createTextStyle();
            newStyle.name = textyle.name;
            newStyle.fontName = textyle.fontName;
            newStyle.fontSize = textyle.fontSize;
            newStyle.lineHeight = textyle.lineHeight;
            newStyle.letterSpacing = textyle.letterSpacing;
            newStyle.paragraphIndent = textyle.paragraphIndent;
            newStyle.paragraphSpacing = textyle.paragraphSpacing;
            newStyle.textDecoration = textyle.textDecoration;
            newStyle.textCase = textyle.textCase;
            newStyle.description = `Created by Textyles, ${new Date()}`;
            const match = currentSelection.find(layer => layer.id === textyle.id)
            if (match) {
                match.textStyleId = newStyle.id
            }

            if (idx === styles.length - 1) {
                figma.notify(`${styles.length} Text Styles created`)
                figma.closePlugin();
            }
        });
    }

    const currentSelection = figma.currentPage.selection;
    const textLayersFromSelection = (selection: any[]) => {
        const textLayers = selection.filter(layer => layer.type === 'TEXT');
        return textLayers.map(layer => {
            const {
                id,
                fontName,
                fontSize,
                letterSpacing,
                lineHeight,
                name,
                paragraphIndent,
                paragraphSpacing,
                textCase,
                textDecoration,
                textStyleId
            } = layer;
            return ({
                id,
                fontName,
                fontSize,
                letterSpacing,
                lineHeight,
                name,
                paragraphIndent,
                paragraphSpacing,
                textCase,
                textDecoration,
                textStyleId
            })
        })
    }
    const currentTextLayers = textLayersFromSelection(currentSelection)

    figma.showUI(__html__, {
        width: 300,
        height: 400,
    });

    figma.ui.postMessage({
        type: 'selection-change',
        message: {
            selection: currentTextLayers
        }
    })

    // Listen for selection changes
    figma.on('selectionchange', () => {
        const newSelection = textLayersFromSelection(figma.currentPage.selection);
        figma.ui.postMessage({
            type: 'selection-change',
            message: {
                selection: newSelection
            }
        })
    })

    figma.ui.onmessage = (msg) => {
        const { type } = msg;

        switch (type) {
            case 'create-styles':
                buildTypeStyles(msg.data.styles);
                return;
            default:
                console.log(msg.type)
        }
    }
}
