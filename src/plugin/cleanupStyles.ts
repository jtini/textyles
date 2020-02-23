export default () => {
    const localTextStyles = figma.getLocalTextStyles()
    const textyles = localTextStyles.map(style => {
        const textyle = figma.getStyleById(style.id)
        const {
            description,
            id,
            key,
            name,
            remote,
            type
        } = textyle
        return ({
            description,
            id,
            key,
            name,
            remote,
            type
        })
    })

    figma.showUI(__html__, {
        width: 300,
        height: 600,
    });

    figma.ui.postMessage({
        type: 'get-local-styles',
        message: {
            styles: textyles
        }
    })

    figma.ui.onmessage = (msg) => {
        const { type } = msg;

        switch (type) {
            case 'delete-styles':
                msg.data.styles.forEach(styleId => {
                    const style = figma.getStyleById(styleId)
                    style.remove();
                })
                figma.notify(`${msg.data.styles.length} Text Styles deleted`)
                figma.closePlugin();
                return;
            default:
                console.log(msg.type)
        }
    }
}