export default () => {
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
        width: 200,
        height: 600,
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
}
