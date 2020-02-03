export const defaultBaseTextProps = {
    textAlignHorizontal: 'LEFT',
    textAlignVertical: 'TOP',
    paragraphIndent: 0,
    paragraphSpacing: 0,
    fontSize: 16,
    fontName: {
        family: 'Roboto',
        style: 'Regular',
    },
    textCase: 'ORIGINAL',
    textDecoration: 'NONE',
    letterSpacing: {
        value: 0,
        unit: 'PERCENT',
    },
    lineHeight: {
        unit: 'AUTO',
    },
    textStyleId: '',
};

export const defaultGroup = [
    {
        nickname: 'Base',
        textProps: { ...defaultBaseTextProps }
    }, {
        nickname: 'Bold',
        textProps: {
            ...defaultBaseTextProps,
            fontName: {
                family: defaultBaseTextProps.fontName.family,
                style: 'Bold'
            }
        }
    }
]

export const defaultSizes = {
    0: {
        name: 'Body',
        step: 0,
    },
    1: {
        name: 'Subheading',
        step: 1,
    },
    2: {
        name: 'Heading',
        step: 2,
    },
    3: {
        name: 'Subtitle',
        step: 3,
    },
    4: {
        name: 'Title',
        step: 4,
    },
};

export const defaultRatio = 1.2;

export const defaultNickname = 'Base';

export const Fonts = {
    base: {
        name: 'Base',
        typeface: 'Inter',
        style: 'Regular',
    },
    bold: {
        name: 'Bold',
        typeface: 'Inter',
        style: 'Bold',
    },
};

export const Typescale = {
    baseSize: 20,
    ratio: 1.33,
};

export const Sizes = {
    0: {
        name: 'Body',
        step: 0,
    },
};

export const globals = {
    lineHeight: {
        value: 125,
        unit: 'PERCENT',
    },
    letterSpacing: {
        value: 0,
        unit: 'PERCENT',
    },
    paragraphSpacing: 0,
    paragraphIndent: 0,
};

// UI Should support an interface for this
export const settings = {
    round: true,
    drawType: true,
};

export default {
    Fonts,
    Typescale,
    Sizes,
    globals,
    settings,
};
