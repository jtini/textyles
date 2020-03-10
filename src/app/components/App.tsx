import * as React from 'react';
import CreateStyles from './CreateStyles/CreateStyles'
import CleanupStyles from './CleanupStyles/CleanupStyles'
import GenerateSizes from './GenerateSizes/GenerateSizes'
import '../styles/ui.css';
import '../styles/figma-plugin-ds.min.css';

const App = () => {
    const [selection, setSelection] = React.useState(null);
    const [sizesSelection, setSizesSelection] = React.useState(null);
    const [textyles, setTextyles] = React.useState(null);
    const [prefs, setPrefs] = React.useState(null)

    const onGenerateSizes = React.useCallback((sizes: {
        name: string,
        fontSize: number
    }[]) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'generate-sizes',
                    data: {
                        sizes,
                    },
                },
            },
            '*'
        );
    }, []);

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

    const onUpdateStep = React.useCallback(({ step, name }: { step: number, name: string }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'generate-sizes:update-step',
                    data: {
                        step,
                        name
                    },
                },
            },
            '*'
        );
    }, []);

    const onUpdateSizePrefs = React.useCallback(({ ratio, stepsBefore, stepsAfter, round }: { ratio: number, stepsBefore: number, stepsAfter: number, round: boolean }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'generate-sizes:update-prefs',
                    data: {
                        ratio,
                        stepsBefore,
                        stepsAfter,
                        round
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
                case 'generate-sizes:hydrate':
                    setPrefs(message.data);
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
                <GenerateSizes
                    selection={sizesSelection}
                    handleSubmit={onGenerateSizes}
                    prefs={prefs}
                    updateStep={onUpdateStep}
                    updatePrefs={onUpdateSizePrefs}
                />
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

export default App