import * as React from 'react';
import CreateStyles from './CreateStyles/CreateStyles'
import CleanupStyles from './CleanupStyles/CleanupStyles'
import GenerateSizes from './GenerateSizes/GenerateSizes'
import '../styles/ui.css';
import '../styles/figma-plugin-ds.min.css';

const App2 = () => {
    const [selection, setSelection] = React.useState(null);
    const [sizesSelection, setSizesSelection] = React.useState(null);
    const [textyles, setTextyles] = React.useState(null);

    const onCreateStyles = React.useCallback((styles: TextNode[]) => {
        console.log('onCreateStyles', { styles })
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'create-styles',
                    data: {
                        styles,
                    },
                },
            },
            '*'
        );
    }, []);

    const onDeleteStyles = React.useCallback((styles: string[]) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'delete-styles',
                    data: {
                        styles,
                    },
                },
            },
            '*'
        );
    }, []);

    React.useEffect(() => {
        window.onmessage = event => {
            const { type, message } = event.data.pluginMessage;

            switch (type) {
                case 'selection-change':
                    setSelection(message.selection);
                    return;
                case 'generate-sizes:selection-change':
                    setSizesSelection(message.selection);
                    return;
                case 'get-local-styles':
                    setTextyles(message.styles)
                    return;
                default:
                    console.log({ type, message })
            }
        }
    }, [])

    return (
        <div>
            {sizesSelection &&
                <GenerateSizes selection={sizesSelection} />
            }
            {selection &&
                <CreateStyles selection={selection} handleSubmit={onCreateStyles} />
            }
            {textyles &&
                <CleanupStyles textyles={textyles} handleSubmit={onDeleteStyles} />
            }
        </div>
    )
}

export default App2