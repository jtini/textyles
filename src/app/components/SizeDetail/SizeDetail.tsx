import React from 'react';
import { Formik } from 'formik';

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
    const { Sizes, name, initialStep, handleGoBack } = props;
    const lineHeight = Sizes[initialStep] && Sizes[initialStep].lineHeight;
    const letterSpacing = Sizes[initialStep] && Sizes[initialStep].letterSpacing;
    console.log({ lineHeight })

    const [lastSavedSize, setLastSaved] = React.useState(Sizes[initialStep]);

    const handleAddSize = React.useCallback((data: { name: string; step: number }) => {
        const { name, step } = data;
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
        (data: { prevSize: { name: string; step: number, lineHeight: LineHeight }; newSize: { name: string; step: number, lineHeight: LineHeight } }) => {
            const { prevSize, newSize } = data;
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

    const handleRemoveSize = React.useCallback(({ size }: { size: { name: string; step: number } }) => {
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
                lineHeight: lineHeight.unit === 'AUTO' ? 'Auto' : lineHeight.value,
                letterSpacing: letterSpacing.value
            }}
            validate={values => {
                const errors = {};
                // console.log({ values })
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                // console.log({ values, setSubmitting })
                if (Sizes[initialStep]) {
                    // Update it
                    handleUpdateSize({
                        prevSize: lastSavedSize,
                        newSize: {
                            name: values.name,
                            step: values.step,
                            lineHeight: {
                                unit: 'AUTO'
                            },
                            letterSpacing: {
                                value: 0,
                                unit: 'PIXELS'
                            }
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
                    lineHeight: {
                        unit: 'AUTO'
                    }
                });

                handleGoBack();

                return null;
            }}
        >
            {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                                <label htmlFor="lineHeight" className="label">
                                    Line Height
                                </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="lineHeight"
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    onBlur={e => {
                                        // Maybe we can highlight this in the preview?

                                        // If the value isn't a number, set it to 'Auto'
                                        if (!parseFloat(e.target.value) && e.target.value !== 'Auto') {
                                            setFieldValue('lineHeight', 'Auto')
                                        } else {
                                            // Set the Size's line height value (up in the controller)
                                        }
                                        handleBlur(e)
                                    }}
                                    value={values.lineHeight}
                                />
                                <label htmlFor="letterSpacing" className="label">
                                    Letter Spacing
                                </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="letterSpacing"
                                    onChange={e => {
                                        handleChange(e);
                                    }}
                                    onBlur={e => {
                                        // Set the Size's letter spacing value (up in the controller)
                                        // This does need to be reflected in the preview
                                        handleBlur(e)
                                    }}
                                    value={values.letterSpacing}
                                />
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
