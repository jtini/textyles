import * as React from 'react'
import { Formik, Form, FieldArray, Field } from 'formik'
import _ from 'lodash'

interface GenerateSizesProps {
    selection: TextNode[];
    handleSubmit: (sizes: {
        name: string,
        fontSize: number
    }[]) => void;
    prefs: {
        ratio: number,
        stepsBefore: number,
        stepsAfter: number
        sizes: {
            name: string,
            step: number
        }[],
        round: boolean
    };
    updateStep: ({ step, name }: { step: number, name: string }) => void;
    updatePrefs: (args: { ratio: number, stepsBefore: number, stepsAfter: number, round: boolean }) => void
}

export default (props: GenerateSizesProps) => {
    const { selection, handleSubmit, sizes, prefs, updateStep, updatePrefs } = props;
    const textLayer = selection[0];
    let fontSize = null;
    if (textLayer) {
        fontSize = textLayer.fontSize
    }

    switch (selection.length) {
        case 0:
            return (
                <div>
                    <h2 className="p-1">Please select a layer to generate sizes from</h2>
                </div>
            )
        case 1:
            return (
                <Formik
                    initialValues={{
                        sizes: prefs.sizes,
                        fontSize,
                        ratio: prefs.ratio,
                        stepsBefore: prefs.stepsBefore,
                        stepsAfter: prefs.stepsAfter,
                        round: prefs.round
                    }}
                    enableReinitialize
                    validate={() => {
                        const errors = {};
                        return errors;
                    }}
                    onSubmit={values => {
                        const { sizes } = values;
                        let actualSizes = []
                        sizes.forEach(size => {
                            const fs = values.fontSize
                            let actualSize = fs;
                            if (size.step < 0) {
                                const divisor = Math.pow(values.ratio, -1 * size.step)
                                actualSize = fs / divisor
                            } else if (size.step > 0) {
                                const multiplier = Math.pow(values.ratio, size.step)
                                actualSize = fs * multiplier
                            }
                            if (values.round) {
                                actualSize = Math.round(actualSize)
                            }
                            actualSizes.push({
                                name: size.name,
                                fontSize: actualSize
                            })
                        })

                        handleSubmit(actualSizes)
                        return null;
                    }}
                >
                    {({ values, handleChange, handleSubmit, setFieldValue }) => (

                        <div className="generate-sizes">
                            <aside className="generate-sizes__sidebar">
                                <Form onSubmit={handleSubmit} className="generate-sizes__form">
                                    <div className="p-1">
                                        <p className="section-title">{`Base Size: ${values.fontSize.toString()}px`}</p>
                                        <label className="label">Ratio</label>
                                        <input
                                            type="number"
                                            className="input"
                                            id="ratio"
                                            name="ratio"
                                            step={0.01}
                                            min={1}
                                            value={values.ratio}
                                            onChange={e => {
                                                handleChange(e)
                                                updatePrefs({
                                                    ...values,
                                                    ratio: parseFloat(e.target.value)
                                                })
                                            }}
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
                                            onChange={e => {
                                                let newSizes = [...values.sizes];

                                                if ((-1 * parseInt(e.target.value)) < values.sizes[0].step) {
                                                    newSizes.unshift({
                                                        name: `Step ${values.sizes[0].step - 1}`,
                                                        step: values.sizes[0].step - 1
                                                    })
                                                } else {
                                                    newSizes.shift()
                                                }

                                                updatePrefs({
                                                    ...values,
                                                    stepsBefore: parseFloat(e.target.value)
                                                })
                                                setFieldValue('sizes', newSizes)
                                                handleChange(e)
                                            }}
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
                                            onChange={e => {
                                                let newSizes = [...values.sizes];

                                                if (parseInt(e.target.value) > values.sizes[values.sizes.length - 1].step) {
                                                    newSizes.push({
                                                        name: `Step ${values.sizes[values.sizes.length - 1].step + 1}`,
                                                        step: values.sizes[values.sizes.length - 1].step + 1
                                                    })
                                                } else {
                                                    newSizes.pop()
                                                }

                                                updatePrefs({
                                                    ...values,
                                                    stepsAfter: parseFloat(e.target.value)
                                                })
                                                setFieldValue('sizes', newSizes)
                                                handleChange(e)
                                            }}
                                        />

                                        <div className="checkbox">
                                            <input
                                                className="checkbox__box"
                                                type="checkbox"
                                                id="round"
                                                checked={values.round}
                                                onChange={e => {

                                                    updatePrefs({
                                                        ...values,
                                                        round: e.target.checked
                                                    })
                                                    handleChange(e);
                                                }}
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
                                </Form>
                            </aside>
                            <main className="generate-sizes__preview">
                                <FieldArray
                                    name="sizes"
                                    render={() => (
                                        <div>
                                            {values.sizes && values.sizes.length > 0 && values.sizes.map((size, idx) => {
                                                const fs = values.fontSize
                                                let actualSize = fs;
                                                if (size.step < 0) {
                                                    const divisor = Math.pow(values.ratio, -1 * size.step)
                                                    actualSize = fs / divisor
                                                } else if (size.step > 0) {
                                                    const multiplier = Math.pow(values.ratio, size.step)
                                                    actualSize = fs * multiplier
                                                }
                                                if (values.round) {
                                                    actualSize = Math.round(actualSize)
                                                }
                                                return (
                                                    <div key={size.step} className="preview-item">
                                                        <div className="flex-wrapper preview-item__top">
                                                            <Field
                                                                name={`sizes.${idx}.name`}
                                                                className="flex-item input"
                                                                style={{ backgroundColor: '#f0f0f0' }}
                                                                onFocus={e => {
                                                                    e.target.select()
                                                                }}
                                                                onChange={e => {
                                                                    handleChange(e)
                                                                    // Update it
                                                                    updateStep({ step: size.step, name: e.target.value })
                                                                }}
                                                            />
                                                            <p>{`${actualSize}px`}</p>
                                                        </div>
                                                        <p
                                                            className="preview-item__sample"
                                                            style={{
                                                                fontSize: actualSize
                                                            }}
                                                        >{`The quick brown fox jumps over the lazy dog`}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                />

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