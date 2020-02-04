import { getComputedFontSize } from '../app/lib/utils';
import { defaultBaseTextProps, defaultGroup, defaultSizes, defaultBaseSize, defaultRatio, defaultNickname } from './properties';

// Whatever gets sent up from App should match this
// App should always send up base text props
let BaseTextProps = { ...defaultBaseTextProps };
let Group = [...defaultGroup];
let BaseSize = defaultBaseSize;
let Ratio = defaultRatio;
let Sizes = { ...defaultSizes };
let Nickname = defaultNickname;
let Round = true;

// This may be useful for setting the fonts in the actual plugin UI
async function getAvailableFonts() {
    const availableFonts = await figma.listAvailableFontsAsync();
    figma.ui.postMessage({
        type: 'fonts-available',
        message: {
            availableFonts
        },
    });
    return availableFonts;
}

async function buildTypeStyles(styles) {
    // const textStyles = figma.getLocalTextStyles();
    Object.keys(styles).forEach(async styleKey => {
        const style = styles[styleKey];
        // const currentStyle = textStyles.find(textStyle => textStyle.description === style.name);

        // if (typeof currentStyle === 'undefined') {
        // There is no existing style, so make a new one
        console.log('buildTypeStyles, style: ', { style });
        await figma.loadFontAsync(style.fontName);
        const newStyle = figma.createTextStyle();
        newStyle.name = style.name;
        newStyle.fontName = style.fontName;
        newStyle.fontSize = style.fontSize;
        newStyle.lineHeight = style.lineHeight;
        newStyle.letterSpacing = style.letterSpacing;
        newStyle.paragraphIndent = style.paragraphIndent;
        newStyle.paragraphSpacing = style.paragraphSpacing;
        // Use the description for matching/reconciling later on
        newStyle.description = style.name;
        // } else {
        // This style already exists
        // TODO: Update the current style
        // NOTE: API support is pendint
        // }
    });
}

const localStyles = figma.getLocalTextStyles();

// Try to use the current selection to set base properties
const currentSelection = figma.currentPage.selection;

if (currentSelection.length === 1 && currentSelection[0].type === 'TEXT') {
    const baseNode = currentSelection[0];
    const {
        textAlignHorizontal,
        textAlignVertical,
        paragraphIndent,
        paragraphSpacing,
        fontSize,
        fontName,
        textCase,
        textDecoration,
        letterSpacing,
        lineHeight,
        textStyleId,
    } = baseNode;

    if (typeof fontName !== 'symbol' && typeof fontSize === 'number') {
        Group[0] = {
            ...Group[0],
            textProps: {
                textAlignHorizontal,
                textAlignVertical,
                paragraphIndent,
                paragraphSpacing,
                fontSize,
                fontName,
                textCase,
                textDecoration,
                letterSpacing,
                lineHeight,
                textStyleId,
            }
        }

        BaseSize = fontSize;
    }
}

figma.showUI(__html__, {
    width: 800,
    height: 600,
});

getAvailableFonts()

// Hydrate the UI
figma.ui.postMessage({
    type: 'update-interface',
    message: {
        Group,
        BaseTextProps,
        BaseSize,
        Ratio,
        Sizes,
        Nickname,
        localStyles,
    },
});

figma.ui.onmessage = msg => {
    console.log('figma.ui.onmessage, before: ', { BaseTextProps, Ratio, Sizes });

    switch (msg.type) {
        case 'set-rounding':
            console.log('set-rounding');
            Round = msg.data.round === 'false' ? false : true;
            break;
        case 'update-nickname':
            console.log('update-nickname');
            Group[msg.data.groupIdx] = {
                ...Group[msg.data.groupIdx],
                nickname: msg.data.Nickname
            }
            break;
        case 'set-base-font-size':
            console.log('set-base-font-size');
            BaseSize = msg.data.BaseSize;
            break;
        case 'set-base-font-style':
            console.log('set-base-font-style');
            Group[msg.data.groupIdx] = {
                ...Group[msg.data.groupIdx],
                textProps: {
                    ...Group[msg.data.groupIdx].textProps,
                    fontName: msg.data.fontName
                }
            }
            break;
        case 'set-base-ratio':
            console.log('set-base-ratio');
            Ratio = msg.data.Ratio;
            break;
        case 'request-preview':
            figma.ui.postMessage({
                type: 'show-preview',
                message: {},
            });
            break;
        case 'update-preview':
            console.log('update-preview');
            break;
        case 'add-size':
            console.log('add-size');
            Sizes = {
                ...Sizes,
                ...msg.data.Sizes,
            };
            break;
        case 'update-size': {
            console.log('update-size');
            let newSizes = { ...Sizes };
            delete newSizes[msg.data.prevSize.step];
            newSizes = {
                ...newSizes,
                [msg.data.newSize.step]: {
                    step: msg.data.newSize.step,
                    name: msg.data.newSize.name,
                },
            };
            Sizes = {
                ...newSizes,
            };
            break;
        }
        case 'remove-size':
            console.log('remove-size');
            let newSizes = { ...Sizes };
            delete newSizes[msg.data.removeSize.step];
            Sizes = {
                ...newSizes,
            };
            break;
        case 'generate-styles':
            console.log('generate-styles');
            let TextStyles = {};

            Group.forEach(group => {

                Object.keys(Sizes).forEach(key => {
                    const size = Sizes[key];
                    // console.log('generate-styles, size: ', { size });
                    const styleKey = `${size.name} / ${group.nickname}`;
                    // console.log('generate-styles, styleKey: ', { styleKey });
                    const textStyle = {
                        ...group.textProps,
                        fontSize: getComputedFontSize({
                            step: size.step,
                            baseSize: BaseSize,
                            ratio: Ratio,
                            // TODO: Make "Round" configurable
                            round: Round,
                        }),
                    };
                    // console.log('generate-styles, textStyle: ', { textStyle });

                    TextStyles = {
                        ...TextStyles,
                        [styleKey]: {
                            name: styleKey,
                            ...textStyle,
                        },
                    };
                });

            })


            console.log('generate-styles, TextStyles: ', { TextStyles });
            buildTypeStyles(TextStyles);
            // NOTE: Closing the plugin at this point can cause styles to not be built
            // figma.closePlugin();
            break;
        case 'clear-local-styles':
            console.log('clear-local-styles');
            Object.keys(localStyles).forEach(key => {
                const id = localStyles[key].id;
                const thisStyle = figma.getStyleById(id);
                thisStyle.remove();
            });
            figma.ui.postMessage({
                type: 'update-interface',
                message: {
                    BaseTextProps,
                    Ratio,
                    Sizes,
                    Nickname,
                    localStyles: [],
                },
            });
            break;
        default:
            console.log('Figma UI Sent a Message: ', { msg });
    }

    // Always update the interface
    figma.ui.postMessage({
        type: 'update-interface',
        message: {
            BaseTextProps,
            BaseSize,
            Ratio,
            Group,
            Sizes,
            Nickname,
            localStyles,
            Round,
        },
    });
};
