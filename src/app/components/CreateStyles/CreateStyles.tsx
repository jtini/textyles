import * as React from 'react'

interface CreateStylesProps {
    selection?: TextNode[],
    handleSubmit: (styles: TextNode[]) => void
}

export default (props: CreateStylesProps) => {
    const { selection, handleSubmit } = props;
    return (

        <div>
            {selection.length > 0 ?
                <div className="create">
                    <header className="create__header">
                        <p className="p-0">{`${selection.length} layers selected`}</p>
                    </header>
                    <div className="create__body">
                        {selection.map(layer => {
                            return (
                                <div key={layer.id} className="textyle">
                                    <div className="icon icon--type" />
                                    <p>{`${layer.name}`}</p>
                                </div>
                            )
                        })}
                    </div>
                    <footer className="create__footer p-1 border-top">
                        <button
                            className="button button--primary"
                            onClick={() => {
                                handleSubmit(selection)
                            }}
                        >{`Create ${selection.length} Text Styles`}</button>
                    </footer>
                </div>
                :
                <h2 className="p-1">No text layers are selected</h2>
            }
        </div>
    )
}