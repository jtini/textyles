import React from 'react';
import { Formik } from 'formik';
import { getComputedFontSize } from '../../lib/utils';
import StyleSwitcher from '../StyleSwitcher/StyleSwitcher';

const STYLES_ORDER = {
    thin: 1,
    'thin italic': 1,
    extralight: 2,
    'extralight italic': 2,
    light: 3,
    'light italic': 3,
    regular: 4,
    italic: 4,
    book: 4,
    medium: 5,
    'medium italic': 5,
    semibold: 6,
    'semibold italic': 6,
    bold: 7,
    'bold italic': 7,
    extrabold: 8,
    'extrabold italic': 8,
    black: 9,
    'black italic': 9
}

interface FormProps {
    baseSize: number;
    Sizes: any;
    setBaseSize: (args: any) => void;
    setRatio: (args: any) => void;
    handlePreviewUpdate: (args: any) => void;
    onClickSize: (args?: any) => void;
    setNickname: ({ nickname }: { nickname: string }) => void;
    round?: boolean;
    BaseSize: number;
    ratio: number;
    baseFontName: {
        family: string;
        style: string;
    };
    nickname: string;
    availableFonts: {
        fontName: {
            family: string,
            style: string
        }
    }[],
    setBaseFontStyle: ({ style, family }: { style: string, family: string }) => void
}

const Form = (props: FormProps) => {
    const {
        baseSize,
        Sizes,
        setBaseSize,
        setRatio,
        onClickSize,
        setNickname,
        nickname,
        BaseSize,
        ratio,
        round,
        baseFontName,
        availableFonts,
        setBaseFontStyle
    } = props;

    const availableStyles = availableFonts.filter(font => font.fontName.family === baseFontName.family)

    const normalStyles = [...availableStyles].filter(font => font.fontName.style.toLocaleLowerCase().indexOf('italic') === -1)
    const italicStyles = [...availableStyles].filter(font => font.fontName.style.toLocaleLowerCase().indexOf('italic') > -1)

    const sortedNormalStyles = [...normalStyles].sort((a, b) => {
        const aOrder = STYLES_ORDER[a.fontName.style.toLowerCase()] || 4;
        const bOrder = STYLES_ORDER[b.fontName.style.toLowerCase()] || 4
        return +aOrder - +bOrder
    })
    const sortedItalicStyles = [...italicStyles].sort((a, b) => {
        const aOrder = STYLES_ORDER[a.fontName.style.toLowerCase()] || 4;
        const bOrder = STYLES_ORDER[b.fontName.style.toLowerCase()] || 4
        return +aOrder - +bOrder
    })

    const sortedStyles = [[...sortedNormalStyles], [...sortedItalicStyles]]

    const handleGenerateStyles = React.useCallback((data: any) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'generate-styles',
                    data: {},
                },
            },
            '*'
        );
    }, []);

    const handleRoundCheck = React.useCallback((checked: boolean) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-rounding',
                    data: {
                        round: `${checked}`,
                    },
                },
            },
            '*'
        );
    }, []);

    return (
        <Formik
            initialValues={{
                baseSize,
                ratio,
                nickname,
            }}
            enableReinitialize
            validate={values => {
                const errors = {};

                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                handleGenerateStyles();
                return null;
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form className="sidebar__inner" onSubmit={handleSubmit}>
                    <div className="sidebar__scrollable">

                        <section className="sidebar-section">
                            <h2 className="section-title">Font</h2>
                            <input className="input" value={baseFontName.family} readOnly />
                            <StyleSwitcher
                                styles={sortedStyles}
                                currentStyle={baseFontName.style}
                                setBaseFontStyle={setBaseFontStyle}
                            />
                        </section>

                        <div className="divider" />

                        <section className="sidebar-section">
                            <h2 className="section-title">Font Nickname</h2>
                            <input
                                className="input"
                                type="text"
                                name="nickname"
                                onChange={e => {
                                    handleChange(e);
                                    setNickname({ nickname: e.target.value });
                                }}
                                onBlur={handleBlur}
                                value={values.nickname}
                            />
                        </section>

                        <div className="divider" />

                        <section className="sidebar-section">
                            <h2 className="section-title">Type Scale</h2>

                            <div className="flex-wrapper">
                                <div className="flex-item">
                                    <label htmlFor="baseSize" className="label">
                                        Base Size
                                    </label>
                                    <input
                                        className="input"
                                        type="number"
                                        name="baseSize"
                                        onChange={e => {
                                            const newSize = parseFloat(e.target.value);
                                            handleChange(e);
                                            setBaseSize({ size: newSize });
                                        }}
                                        onBlur={handleBlur}
                                        value={values.baseSize}
                                    />
                                </div>
                                <div className="flex-item">
                                    <label htmlFor="ratio" className="label">
                                        Ratio
                                    </label>
                                    <input
                                        className="input"
                                        type="number"
                                        step="0.1"
                                        name="ratio"
                                        onChange={e => {
                                            const newRatio = parseFloat(e.target.value);
                                            setRatio({ ratio: newRatio });
                                            handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.ratio}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="divider" />

                        <section className="sidebar-section">
                            <h2 className="section-title">Sizes</h2>
                            {Object.keys(Sizes)
                                .sort((a, b) => +a - +b)
                                .map(key => {
                                    const Size = Sizes[key];
                                    const actualSize = getComputedFontSize({ step: Size.step, baseSize: BaseSize, ratio, round });

                                    return (
                                        <div key={key} className="size">
                                            <span className="size__sample" style={{ fontFamily: baseFontName.family }}>
                                                Ag
                                            </span>
                                            <span className="size__text">{`${Size.name}, ${actualSize}px`}</span>
                                            <div
                                                className="icon icon--adjust icon--button"
                                                onClick={() => onClickSize({ step: Size.step.toString() })}
                                            />
                                        </div>
                                    );
                                })}
                            <button
                                className="button button--secondary add-size"
                                onClick={() => onClickSize({})}
                                type="button"
                            >
                                Add a size
                            </button>
                        </section>

                        <div className="divider" />

                        <section className="sidebar-section">
                            <h2 className="section-title">Options</h2>
                            <div className="checkbox">
                                <input
                                    className="checkbox__box"
                                    type="checkbox"
                                    id="round"
                                    defaultChecked
                                    onChange={e => {
                                        handleRoundCheck(e.target.checked);
                                    }}
                                />
                                <label className="checkbox__label" htmlFor="round">
                                    Round values
                                </label>
                            </div>
                        </section>
                    </div>
                    <footer className="sidebar-footer">
                        <button type="submit" className="button button--primary" disabled={isSubmitting}>
                            Generate Text Styles
                        </button>
                    </footer>
                </form>
            )}
        </Formik>
    );
};

export default Form;
