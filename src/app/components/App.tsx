import * as React from 'react';
import WebFont from 'webfontloader';
import cx from 'classnames';
import { defaultBaseTextProps, defaultSizes, defaultRatio, defaultNickname } from '../../plugin/properties';
import { getComputedFontSize } from '../lib/utils';
import Form from './Form/Form';
import SizeDetail from './SizeDetail/SizeDetail';
import _ from 'lodash';
import icon from '../assets/Icon.svg';
import '../styles/ui.css';
import '../styles/figma-plugin-ds.min.css';

const FONT_WEIGHTS = {
    thin: 100,
    100: 100,
    extralight: 200,
    200: 200,
    light: 300,
    300: 300,
    normal: 400,
    regular: 400,
    italic: 400,
    book: 400,
    400: 400,
    medium: 500,
    500: 500,
    semibold: 600,
    600: 600,
    bold: 700,
    700: 700,
    extrabold: 800,
    800: 800,
    black: 900,
    ultrabold: 900,
    900: 900,
};

const App = ({ }) => {
    // Need to set initial states from the controller's
    const [BaseTextProps, setBaseTextProps] = React.useState(defaultBaseTextProps);
    const [Sizes, updateSizes] = React.useState(defaultSizes);
    const [Ratio, updateRatio] = React.useState(defaultRatio);
    const [Nickname, updateNickname] = React.useState(defaultNickname);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [localStyles, setLocalStyles] = React.useState([]);
    const [availableFonts, setAvailableFonts] = React.useState([]);

    // TODO: Make this setting
    const [round, setRound] = React.useState(true);

    const [isSidebarVisible, setFormVisible] = React.useState(false);
    const [sidebar, setSidebar] = React.useState('form');

    const onClickShowPreview = React.useCallback(() => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'request-preview',
                },
            },
            '*'
        );
    }, []);

    const handlePreviewUpdate = React.useCallback((data: { size?: number; ratio?: number }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'update-preview',
                    data: {
                        size: data.size || BaseTextProps.fontSize,
                        ratio: data.ratio || Ratio,
                        BaseTextProps: {
                            fontSize: data.size || BaseTextProps.fontSize,
                        },
                        Ratio: data.ratio || Ratio,
                    },
                },
            },
            '*'
        );
    }, []);

    const onClickSize = ({ step }: { step?: string }) => {
        if (step) {
            console.log('onClickSize step', { step });
            setCurrentStep(parseInt(step));
        } else {
            setCurrentStep(Math.max(...Object.keys(Sizes).map(str => parseFloat(str))) + 1);
        }

        setSidebar('size-detail');
    };

    const setBaseFontSize = React.useCallback(({ size }: { size: number }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-base-font-size',
                    data: {
                        BaseTextProps: {
                            fontSize: size,
                        },
                    },
                },
            },
            '*'
        );
    }, []);

    const setBaseFontStyle = React.useCallback(({ style, family }: { style: string, family: string }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-base-font-style',
                    data: {
                        BaseTextProps: {
                            fontName: {
                                family,
                                style
                            },
                        },
                    },
                },
            },
            '*'
        );
    }, []);

    const setTypescaleRatio = React.useCallback(({ ratio }: { ratio: number }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'set-base-ratio',
                    data: {
                        Ratio: ratio,
                    },
                },
            },
            '*'
        );
    }, []);

    const onClickClearStyles = React.useCallback(() => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'clear-local-styles',
                },
            },
            '*'
        );
    }, []);

    const onChangeNickname = React.useCallback(({ nickname }: { nickname: string }) => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'update-nickname',
                    data: {
                        Nickname: nickname,
                    },
                },
            },
            '*'
        );
    }, []);

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = event => {
            const { type, message } = event.data.pluginMessage;

            switch (type) {
                case 'fonts-available':
                    console.log('fonts-available');
                    setAvailableFonts(message.availableFonts)
                    break;
                case 'update-interface':
                    // Update local BaseTextProps
                    console.log('update-interface', { message });
                    setBaseTextProps(message.BaseTextProps);
                    updateSizes(message.Sizes);
                    updateRatio(message.Ratio);
                    updateNickname(message.Nickname);
                    setLocalStyles(message.localStyles);
                    setRound(message.Round);
                    break;
                case 'show-preview':
                    // TODO: Load the font if it's from Google Fonts
                    // if (message.baseSize) {
                    setFormVisible(true);
                    // }
                    break;
                case 'generate-styles':
                    console.log(`Figma Says: ${message}`);
                    break;
                default:
                    console.log('App received a message: ', { message });
            }
        };
    }, []);

    // Split and translate for styling and correct font loading
    const splitStyle = BaseTextProps.fontName.style.split(' ');
    let style = 'normal';
    if (BaseTextProps.fontName.style.toLowerCase().indexOf('italic') > -1) {
        style = 'italic'
    }

    const weight = FONT_WEIGHTS[splitStyle[0].toLowerCase()] || '400';

    let specifier = '400';

    if (weight !== 400) {
        specifier = `${weight.toString()}`
    }
    if (style === 'italic') {
        specifier = `i${specifier}`;
    }
    // Try to load the font from Google
    // There seems to be a caching issue affecting the preview?
    // May try using a <style> tag with Helmet instead
    WebFont.load({
        google: {
            families: [`${BaseTextProps.fontName.family}:${specifier}`],
        },
    });

    // TODO: Have the controller send this more explicitly, i.e. is there actually a selection
    const hasNoSelection = _.isEqual(BaseTextProps, defaultBaseTextProps);

    return (
        <div className="wrapper type--pos-small-normal">
            {isSidebarVisible && (
                <aside className="sidebar">
                    {sidebar === 'form' && (
                        <Form
                            Sizes={Sizes}
                            baseSize={BaseTextProps.fontSize}
                            setBaseSize={setBaseFontSize}
                            setRatio={setTypescaleRatio}
                            handlePreviewUpdate={handlePreviewUpdate}
                            onClickSize={onClickSize}
                            baseFontName={BaseTextProps.fontName}
                            setNickname={onChangeNickname}
                            nickname={Nickname}
                            round={round}
                            ratio={Ratio}
                            availableFonts={availableFonts}
                            setBaseFontStyle={setBaseFontStyle}
                        />
                    )}
                    {sidebar === 'size-detail' && (
                        <SizeDetail
                            Sizes={Sizes}
                            name={Sizes[currentStep] ? Sizes[currentStep].name : ''}
                            handleGoBack={() => setSidebar('form')}
                            initialStep={currentStep}
                        />
                    )}
                </aside>
            )}
            <main className="preview">
                {isSidebarVisible ? (
                    <div>
                        {Object.keys(Sizes)
                            .sort((a, b) => +a - +b)
                            .map(key => {
                                const Size = Sizes[key];
                                const actualSize = getComputedFontSize({
                                    step: Size.step,
                                    baseSize: BaseTextProps.fontSize,
                                    ratio: Ratio,
                                    round,
                                });
                                return (
                                    <div
                                        key={key}
                                        className={cx('preview-item', {
                                            'preview-item--subdued':
                                                sidebar === 'size-detail' && currentStep.toString() !== key,
                                            'preview-item--selected':
                                                sidebar === 'size-detail' && currentStep.toString() === key,
                                        })}
                                    >
                                        <p className="preview-item__description">
                                            <span className="preview-item__description-string">{`${Size.name} / ${Nickname}`}</span>
                                            <span className="preview-item__description-string">{`${actualSize}px`}</span>
                                        </p>
                                        <p
                                            className="preview-item__sample"
                                            style={{
                                                fontSize: actualSize,
                                                fontFamily: `"${BaseTextProps.fontName.family}"`,
                                                fontWeight: weight,
                                                fontStyle: style,
                                            }}
                                        >
                                            The quick brown fox jumps over the lazy dog
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                        <div className="empty-preview">
                            <img src={icon} width={80} height={80} className="icon" />
                            <h1 className="title">Textyles</h1>
                            <button onClick={onClickShowPreview} className="button button--primary">
                                Create Text Styles
                        </button>
                            <p className="hint">Hint: select a text layer to base styles on its properties.</p>

                            {localStyles.length > 0 && (
                                <button onClick={onClickClearStyles} className="button button--secondary">
                                    Clear Local Text Styles
                            </button>
                            )}
                            <p className="credit">
                                Made with ♥ by{' '}
                                <a href="https://tinyeahno.com" target="_blank">
                                    Jeremy Tinianow
                            </a>
                            </p>
                            <p className="credit">
                                Contribute on{' '}
                                <a href="https://github.com/jtini/textyles" target="_blank">
                                    Github
                            </a>
                            </p>
                        </div>
                    )}
            </main>
        </div>
    );
};

export default App;
