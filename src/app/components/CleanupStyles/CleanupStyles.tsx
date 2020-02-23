import * as React from 'react';
import { Formik } from 'formik';

interface CleaupStylesProps {
    textyles: TextStyle[],
    handleSubmit: (ids: string[]) => void
}

export default (props: CleaupStylesProps) => {
    const { textyles, handleSubmit } = props;
    const textyleIds = textyles.map(textyle => textyle.id)
    return (
        <div className="cleanup">
            {textyles.length > 0 ?
                <Formik
                    initialValues={{
                        selection: [...textyleIds]
                    }}
                    validate={() => {
                        const errors = {};
                        return errors;
                    }}
                    onSubmit={values => {
                        const { selection } = values;
                        handleSubmit(selection)
                        return null;
                    }}
                >
                    {({ values, handleChange, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="cleanup__inner">
                            <header className="cleanup__header">
                                <div className="checkbox">
                                    <input
                                        className="checkbox__box"
                                        type="checkbox"
                                        id="all"
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setFieldValue('selection', [...textyleIds])
                                            } else {
                                                setFieldValue('selection', [])
                                            }
                                            handleChange(e)
                                        }}
                                        checked={values.selection.length === textyleIds.length}
                                    />
                                    <label className="checkbox__label" htmlFor="all">{`${values.selection.length} styles selected`}</label>
                                </div>
                            </header>

                            <section className="cleanup__body">
                                {textyles.map(textyle => (
                                    <div className="checkbox" key={textyle.id}>
                                        <input
                                            className="checkbox__box"
                                            type="checkbox"
                                            id={textyle.id}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setFieldValue('selection', [
                                                        ...values.selection,
                                                        textyle.id
                                                    ])
                                                } else {
                                                    const newSelection = [...values.selection].filter(str => str !== textyle.id)
                                                    setFieldValue('selection', newSelection)
                                                }
                                                handleChange(e)
                                            }}
                                            checked={values.selection.indexOf(textyle.id) > -1}
                                        />
                                        <label className="checkbox__label" htmlFor={textyle.id}>{textyle.name}</label>
                                    </div>
                                ))}
                            </section>

                            <footer className="cleanup__footer">
                                <button className="button button--primary-destructive" type="submit">Delete styles</button>
                            </footer>
                        </form>
                    )}
                </Formik>
                :
                <h2 className="p-1">No local Text Styles exist</h2>
            }
        </div>
    )
}