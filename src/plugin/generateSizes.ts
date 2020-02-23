export default () => {
    const currentSelection = figma.currentPage.selection;
    const textLayersFromSelection = (selection: readonly SceneNode[]) => {
        const textLayers = selection.filter(layer => layer.type === 'TEXT');
        return textLayers.map(layer => {
            if (layer.type === 'TEXT') {
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
            }
        })
    }
    const currentTextLayers = textLayersFromSelection(currentSelection)

    async function drawLayers(sizes) {
        const currentSelection = figma.currentPage.selection;
        let textY = currentSelection[0].y + currentSelection[0].height + 24;
        sizes.forEach(async size => {
            if (currentSelection[0].type === "TEXT" && typeof currentSelection[0].fontName !== 'symbol') {
                // Load the font
                await figma.loadFontAsync(currentSelection[0].fontName)
                // Draw a layer
                const text = currentSelection[0].clone()
                // Make it auto resize
                text.textAutoResize = 'WIDTH_AND_HEIGHT'
                // Set some copy in it
                text.characters = "The Quick Brown Fox Jumps Over The Lazy Dog"
                // Style it to match this size
                text.fontSize = size.fontSize;
                // Name it with the right name
                text.name = size.name
                // Add it below the latest one
                currentSelection[0].parent.appendChild(text)
                text.y = textY
                textY += (size.fontSize * 1.5) + 24;
            }
        })
    }

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

    figma.ui.onmessage = (msg) => {
        const { type } = msg;

        switch (type) {
            case 'generate-sizes':
                console.log('generate-sizes', msg.data.sizes)
                drawLayers(msg.data.sizes)
                return;
            default:
                console.log(msg.type)
        }
    }
}