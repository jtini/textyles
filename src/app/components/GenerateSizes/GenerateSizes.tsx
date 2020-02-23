import * as React from 'react'
import { Formik, Form, FieldArray, Field } from 'formik'
import _ from 'lodash'

interface GenerateSizesProps {
    selection: TextNode[];
    handleSubmit: (sizes: {
        name: string,
        fontSize: number
    }[]) => void
}

export default (props: GenerateSizesProps) => {
    const { selection, handleSubmit } = props;
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
                        sizes: [
                            {
                                name: 'Small Body',
                                step: -1
                            }, {
                                name: 'Body',
                                step: 0
                            }, {
                                name: 'Subheading',
                                step: 1
                            }, {
                                name: 'Heading',
                                step: 2
                            }, {
                                name: 'Subtitle',
                                step: 3
                            }, {
                                name: 'Title',
                                step: 4
                            }
                        ],
                        fontSize,
                        ratio: 1.2,
                        stepsBefore: 1,
                        stepsAfter: 4,
                        round: true,
                        stepNames: ['Body', 'Subheading', 'Heading', 'Subtitle', 'Title'],
                        negStepNames: ['Small Body']
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
                                        <label className="section-title">Ratio</label>
                                        <input
                                            type="number"
                                            className="input"
                                            id="ratio"
                                            name="ratio"
                                            step={0.01}
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
                                </Form>
                            </aside>
                            <main className="generate-sizes__preview">
                                <FieldArray
                                    name="sizes"
                                    render={arrayHelpers => (
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