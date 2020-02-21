import * as React from 'react';
import CleanupStyles from './CleanupStyles/CleanupStyles'
import '../styles/ui.css';
import '../styles/figma-plugin-ds.min.css';

const App2 = () => {
    const [selection, setSelection] = React.useState(null);
    const [textyles, setTextyles] = React.useState(null);

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
                case 'get-local-styles':
                    setTextyles(message.styles)
                    return;
                default:
                // console.log({ type, message })
            }
        }
    }, [])

    return (
        <div>
            {selection &&
                <div>
                    {selection.length > 0 ?
                        <div>
                            {selection.map(layer => {
                                return (
                                    <div key={layer.id}>
                                        <p>{layer.name}</p>
                                        <p>{`${layer.fontSize.toString()}px`}</p>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <h2>No text layers are selected</h2>
                    }
                </div>
            }

            {textyles &&
                <CleanupStyles textyles={textyles} handleSubmit={onDeleteStyles} />
            }
        </div>
    )
}

export default App2