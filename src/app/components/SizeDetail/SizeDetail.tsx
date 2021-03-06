import React from 'react';
import {Formik} from 'formik';

interface SizeDetailProps {
    Sizes: any;
    initialStep: number | string;
    name?: string;
    handleGoBack: () => void;
}

const SIZE_DEFAULT_NAMES = {
    '-2': 'Label',
    '-1': 'Small Body',
    '0': 'Body',
    '1': 'Subheading',
    '2': 'Heading',
    '3': 'Subtitle',
    '4': 'Title',
};

const SizeDetail = (props: SizeDetailProps) => {
    // TODO: See if we already have the size step
    const {Sizes, name, initialStep, handleGoBack} = props;

    const [lastSavedSize, setLastSaved] = React.useState({});

    const handleAddSize = React.useCallback((data: {name: string; step: number}) => {
        const {name, step} = data;
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'add-size',
                    data: {
                        Sizes: {
                            [step]: {
                                name,
                                step,
                            },
                        },
                    },
                },
            },
            '*'
        );
    }, []);

    const handleUpdateSize = React.useCallback(
        (data: {prevSize: {name: string; step: number}; newSize: {name: string; step: number}}) => {
            const {prevSize, newSize} = data;
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'update-size',
                        data: {
                            prevSize,
                            newSize,
                        },
                    },
                },
                '*'
            );
        },
        []
    );

    const handleRemoveSize = React.useCallback(({size}: {size: {name: string; step: number}}) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'remove-size',
                    data: {
                        removeSize: size,
                    },
                },
            },
            '*'
        );
    }, []);

    return (
        <Formik
            initialValues={{
                name: name || SIZE_DEFAULT_NAMES[initialStep] || initialStep,
                step: initialStep,
            }}
            validate={values => {
                const errors = {};

                return errors;
            }}
            onSubmit={(values, {setSubmitting}) => {
                if (Sizes[initialStep]) {
                    // Update it
                    handleUpdateSize({
                        prevSize: lastSavedSize,
                        newSize: {
                            name: values.name,
                            step: values.step,
                        },
                    });
                } else {
                    // Create it
                    handleAddSize({
                        name: values.name,
                        step: values.step,
                    });
                    // setSizeExists(true);
                }

                // Always save the last version of this size
                setLastSaved({
                    name: values.name,
                    step: values.step,
                });

                handleGoBack();

                return null;
            }}
        >
            {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                <>
                    <section className="sidebar-section">
                        <div className="flex-wrapper">
                            <div onClick={handleGoBack} className="back-button icon icon--button icon--return" />
                            {Sizes[initialStep] && (
                                <div
                                    className="icon icon--button icon--trash delete-button"
                                    onClick={() => {
                                        handleRemoveSize({
                                            size: {
                                                name: values.name,
                                                step: values.step,
                                            },
                                        });
                                        handleGoBack();
                                    }}
                                />
                            )}
                        </div>
                    </section>
                    <form className="sidebar__inner" onSubmit={handleSubmit}>
                        <div className="sidebar__scrollable">
                            <section className="sidebar-section">
                                <div className="form-row">
                                    <div className="flex-wrapper">
                                        <div className="flex-item">
                                            <label htmlFor="name" className="label">
                                                Name
                                            </label>
                                            <input
                                                className="input"
                                                type="text"
                                                name="name"
                                                onChange={e => {
                                                    handleChange(e);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.name}
                                            />
                                        </div>
                                        <div className="flex-item">
                                            <label htmlFor="step" className="label">
                                                Step
                                            </label>
                                            <input
                                                className="input"
                                                type="number"
                                                name="step"
                                                onChange={e => {
                                                    handleChange(e);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.step}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <footer className="sidebar-footer">
                            <button type="submit" className="button button--primary" disabled={isSubmitting}>
                                {Sizes[initialStep] ? `Update Size` : `Add Size`}
                            </button>
                        </footer>
                    </form>
                </>
            )}
        </Formik>
    );
};

export default SizeDetail;
