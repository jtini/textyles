import React from 'react';
import cx from 'classnames'
import WebFont from 'webfontloader';
import { getComputedFontSize } from '../../lib/utils';

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

interface PreviewProps {
    nickname: string;
    textProps: {
        textAlignHorizontal: string,
        textAlignVertical: string,
        paragraphIndent: number,
        paragraphSpacing: number,
        fontSize: number,
        fontName: {
            family: string,
            style: string,
        },
        textCase: string,
        textDecoration: string,
        letterSpacing: {
            value: number,
            unit: string,
        },
        lineHeight: {
            unit: string,
        },
        textStyleId?: string
    },
    Sizes: any;
    BaseSize: number;
    Ratio: number;
    currentStep: number;
    round: boolean;
    sidebar: string;
}

const Preview = (props: PreviewProps) => {
    const { nickname, textProps, Sizes, BaseSize, Ratio, currentStep, round, sidebar } = props;
    const splitStyle = textProps.fontName.style.split(' ');
    let style = 'normal';
    if (textProps.fontName.style.toLowerCase().indexOf('italic') > -1) {
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

    WebFont.load({
        google: {
            families: [`${textProps.fontName.family}:${specifier}`],
        },
    });

    return (
        <div>
            {Object.keys(Sizes)
                .sort((a, b) => +a - +b)
                .map(key => {
                    const Size = Sizes[key];
                    const actualSize = getComputedFontSize({
                        step: Size.step,
                        baseSize: BaseSize,
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
                                <span className="preview-item__description-string">{`${Size.name} / ${nickname}`}</span>
                                <span className="preview-item__description-string">{`${actualSize}px`}</span>
                            </p>
                            <p
                                className="preview-item__sample"
                                style={{
                                    fontSize: actualSize,
                                    fontFamily: `"${textProps.fontName.family}"`,
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
    )
}

export default Preview