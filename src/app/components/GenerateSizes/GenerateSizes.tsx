import * as React from 'react'
import { Formik } from 'formik'
import _ from 'lodash'

interface GenerateSizesProps {
    selection: TextNode[]
}

export default (props: GenerateSizesProps) => {
    const { selection } = props;
    const textLayer = selection[0];
    let fontSize = null;
    if (textLayer) {
        fontSize = textLayer.fontSize
    }

    switch (selection.length) {
        case 0:
            return <p>Please select a layer to generate sizes from</p>
        case 1:
            return (
                <Formik
                    initialValues={{
                        fontSize,
                        ratio: 1.2,
                        stepsBefore: 1,
                        stepsAfter: 5,
                        round: true,
                        stepNames: ['Body', 'Subheading', 'Heading', 'Subtitle', 'Title'],
                        negStepNames: ['Small Body']
                    }}
                    validate={() => {
                        const errors = {};
                        return errors;
                    }}
                    onSubmit={values => {
                        const { fontSize, ratio } = values;
                        return null;
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (

                        <div className="generate-sizes">
                            <aside className="generate-sizes__sidebar">
                                <form onSubmit={handleSubmit} className="generate-sizes__form">
                                    <div className="p-1">
                                        <p className="section-title">{`Base Size: ${values.fontSize.toString()}px`}</p>
                                        <label className="section-title">Ratio</label>
                                        <input
                                            type="number"
                                            className="input"
                                            id="ratio"
                                            name="ratio"
                                            step={0.1}
                                            min={1}
                                            value={values.ratio}
                                            onChange={handleChange}
                                        />
                                        <label className="label">Steps Before</label>
                                        <input
                                            type="number"
                                            className="input"
                                            id="stepsBefore"
                                            name="stepsBefore"
                                            step={1}
                                            min={0}
                                            value={values.stepsBefore}
                                            onChange={handleChange}
                                        />
                                        <label className="label">Steps After</label>
                                        <input
                                            type="number"
                                            className="input"
                                            id="stepsAfter"
                                            name="stepsAfter"
                                            step={1}
                                            min={0}
                                            value={values.stepsAfter}
                                            onChange={handleChange}
                                        />

                                        <div className="checkbox">
                                            <input
                                                className="checkbox__box"
                                                type="checkbox"
                                                id="round"
                                                checked={values.round}
                                                onChange={handleChange}
                                            />
                                            <label className="checkbox__label" htmlFor="round">Round</label>
                                        </div>

                                    </div>
                                    <footer className="p-1">
                                        <button
                                            type="submit"
                                            className="button button--primary">
                                            Generate Sizes
                                        </button>
                                    </footer>
                                </form>
                            </aside>
                            <main className="generate-sizes__preview">
                                {_.times(values.stepsBefore, i => {
                                    const size = values.fontSize
                                    const divisor = Math.pow(values.ratio, values.stepsBefore - i)
                                    let actualSize = typeof size === 'number' ? size / divisor : 0;
                                    if (values.round) {
                                        actualSize = Math.round(actualSize)
                                    }

                                    return (
                                        <div key={i} className="preview-item">
                                            <input
                                                type="text"
                                                placeholder={values.negStepNames[values.stepsBefore - i - 1] || (-1 * (values.stepsBefore - i)).toString()}
                                            />
                                            <p>{`${actualSize}px`}</p>
                                            <p
                                                className="preview-item__sample"
                                                style={{
                                                    fontSize: actualSize
                                                }}
                                            >{`The quick brown fox jumps over the lazy dog`}</p>
                                        </div>
                                    )
                                })}
                                <div className="preview-item">
                                    <input
                                        type="text"
                                        placeholder={values.stepNames[0]}
                                    />
                                    <p>{`${values.fontSize}px`}</p>
                                    <p
                                        className="preview-item__sample"
                                        style={{
                                            fontSize: values.fontSize
                                        }}
                                    >{`The quick brown fox jumps over the lazy dog`}</p>
                                </div>
                                {_.times(values.stepsAfter, i => {
                                    const size = values.fontSize
                                    const multiplier = Math.pow(values.ratio, i + 1)
                                    let actualSize = typeof size === 'number' ? size * multiplier : 0;
                                    if (values.round) {
                                        actualSize = Math.round(actualSize)
                                    }

                                    return (
                                        <div key={i} className="preview-item">
                                            <input
                                                type="text"
                                                placeholder={values.stepNames[i] || i.toString()}
                                            />
                                            <p>{`${actualSize}px`}</p>
                                            <p
                                                className="preview-item__sample"
                                                style={{
                                                    fontSize: actualSize
                                                }}
                                            >{`The quick brown fox jumps over the lazy dog`}</p>
                                        </div>
                                    )
                                })}

                            </main>
                        </div>
                    )}
                </Formik>
            )
        default:
            return (
                <p>{`${selection.length} layers selected. Please only select one.`}</p>
            )
    }
}