import * as React from 'react';
import cx from 'classnames'
import { defaultBaseTextProps, defaultGroup, defaultSizes, defaultRatio } from '../../plugin/properties';
import Form from './Form/Form';
import Preview from './Preview/Preview';
import SizeDetail from './SizeDetail/SizeDetail';
import _ from 'lodash';
import icon from '../assets/Icon.svg';
import '../styles/ui.css';
import '../styles/figma-plugin-ds.min.css';

const App = ({ }) => {
    // Need to set initial states from the controller's
    const [BaseTextProps, setBaseTextProps] = React.useState(defaultBaseTextProps);
    const [Group, setGroup] = React.useState(defaultGroup);
    const [Sizes, updateSizes] = React.useState(defaultSizes);
    const [Ratio, updateRatio] = React.useState(defaultRatio);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [localStyles, setLocalStyles] = React.useState([]);
    const [availableFonts, setAvailableFonts] = React.useState([]);
    const [currentGroup, setCurrentGroup] = React.useState(0);

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
                    setGroup(message.Group);
                    updateSizes(message.Sizes);
                    updateRatio(message.Ratio);
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

    return (
        <div className="wrapper type--pos-small-normal">
            {isSidebarVisible && (
                <aside className="sidebar">
                    {sidebar === 'form' && (
                        <Form
                            Sizes={Sizes}
                            baseSize={Group[currentGroup].textProps.fontSize}
                            setBaseSize={setBaseFontSize}
                            setRatio={setTypescaleRatio}
                            handlePreviewUpdate={handlePreviewUpdate}
                            onClickSize={onClickSize}
                            baseFontName={Group[currentGroup].textProps.fontName}
                            setNickname={onChangeNickname}
                            nickname={Group[currentGroup].nickname}
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
                        <div className="tabs">
                            {Group.map((group, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentGroup(idx)}
                                    className={cx("button tab", {
                                        "tab--is-active": currentGroup === idx
                                    })}
                                >
                                    {group.nickname}
                                </button>
                            ))}
                            <button className="button button--secondary">Add a group</button>
                        </div>
                        {Group.map((group, idx) => {

                            if (idx === currentGroup) {
                                return (
                                    <div key={idx}>
                                        <Preview
                                            Sizes={Sizes}
                                            Ratio={Ratio}
                                            currentStep={currentStep}
                                            round={round}
                                            sidebar={sidebar}
                                            {...group}
                                        />
                                    </div>
                                )
                            }

                            return null
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
