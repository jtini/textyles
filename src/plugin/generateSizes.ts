export default () => {
    const currentSelection = figma.currentPage.selection;
    const textLayersFromSelection = (selection: any[]) => {
        const textLayers = selection.filter(layer => layer.type === 'TEXT');
        return textLayers.map(layer => {
            let fontSize = layer.fontSize;

            if (typeof layer.fontSize === 'symbol') {
                fontSize = 0;
                figma.notify('Please select one layer with one font size')
                figma.closePlugin()
            }

            const {
                id,
                fontName,
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
        width: 800,
        height: 500,
    });

    figma.ui.postMessage({
        type: 'generate-sizes:selection-change',
        message: {
            selection: currentTextLayers
        }
    })

    // Listen for selection changes
    figma.on('selectionchange', () => {
        const newSelection = textLayersFromSelection(figma.currentPage.selection);
        figma.ui.postMessage({
            type: 'generate-sizes:selection-change',
            message: {
                selection: newSelection
            }
        })
    })
}