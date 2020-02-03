import { getComputedFontSize } from '../app/lib/utils';
import { defaultBaseTextProps, defaultSizes, defaultRatio, defaultNickname } from './properties';

// Whatever gets sent up from App should match this
// App should always send up base text props
let BaseTextProps: {
    textAlignHorizontal: string;
    textAlignVertical: string;
    paragraphIndent: number;
    paragraphSpacing: number;
    fontSize: number;
    fontName: FontName | PluginAPI['mixed'];
    textCase: TextCase | PluginAPI['mixed'];
    textDecoration: TextDecoration | PluginAPI['mixed'];
    letterSpacing: LetterSpacing | PluginAPI['mixed'];
    lineHeight: LineHeight | PluginAPI['mixed'];
    textStyleId: string | PluginAPI['mixed'];
} = defaultBaseTextProps;
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
        console.log({ newStyle })
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
        BaseTextProps = {
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
        };
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
        BaseTextProps,
        Ratio,
        Sizes,
        Nickname,
        localStyles,
    },
});

figma.ui.onmessage = msg => {
    // Update whatever we need to beforehand
    if (msg.data) {
        console.log('msg.data: ', msg.data);
        // If the message updates the nickname
        if (msg.data.Nickname) {
            Nickname = msg.data.Nickname;
        }
        // If the message includes changes to base text props
        if (msg.data.BaseTextProps) {
            BaseTextProps = {
                ...BaseTextProps,
                ...msg.data.BaseTextProps,
            };
        }
        // If the message updates the ratio
        if (msg.data.Ratio) {
            console.log('controller: update Ratio');
            Ratio = msg.data.Ratio;
        }

        // If the message updates sizes
        if (msg.data.Sizes) {
            console.log('controller: update Sizes');
            Sizes = {
                ...Sizes,
                ...msg.data.Sizes,
            };
        }

        // If the message updates a size
        if (msg.data.prevSize && msg.data.newSize) {
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
        }

        // If we need to remove a size
        if (msg.data.removeSize) {
            let newSizes = { ...Sizes };
            delete newSizes[msg.data.removeSize.step];
            Sizes = {
                ...newSizes,
            };
        }

        // If rounding changed
        if (msg.data.round) {
            Round = msg.data.round === 'false' ? false : true;
        }
    }

    console.log('figma.ui.onmessage, before: ', { BaseTextProps, Ratio, Sizes });

    // Always update the interface
    figma.ui.postMessage({
        type: 'update-interface',
        message: {
            BaseTextProps,
            Ratio,
            Sizes,
            Nickname,
            localStyles,
            Round,
        },
    });

    switch (msg.type) {
        case 'set-rounding':
            console.log('set-rounding');
            break;
        case 'update-nickname':
            console.log('update-nickname');
            break;
        case 'set-base-font-size':
            console.log('set-base-font-size');
            break;
        case 'set-base-font-style':
            console.log('set-base-font-style');
            break;
        case 'set-base-ratio':
            console.log('set-base-ratio');
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
            break;
        case 'update-size':
            console.log('update-size');
            break;
        case 'remove-size':
            console.log('remove-size');
            break;
        case 'generate-styles':
            console.log('generate-styles');
            let TextStyles = {};

            Object.keys(Sizes).forEach(key => {
                const size = Sizes[key];
                // console.log('generate-styles, size: ', { size });
                const styleKey = `${size.name} / ${Nickname}`;
                // console.log('generate-styles, styleKey: ', { styleKey });
                const textStyle = {
                    ...BaseTextProps,
                    fontSize: getComputedFontSize({
                        step: size.step,
                        baseSize: BaseTextProps.fontSize,
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
};
