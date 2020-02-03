import React from 'react'

interface StyleSwitcherProps {
    styles: {
        fontName: {
            family: string,
            style: string
        }
    }[];
    currentStyle: string;
    setBaseFontStyle: ({ style, family }: { style: string, family: string }) => void;
    baseFontName: {
        family: string,
        style: string
    }
}

const StyleSwitcher = (props: StyleSwitcherProps) => {
    const { styles, currentStyle, setBaseFontStyle, baseFontName } = props;
    console.log({ currentStyle })

    return (
        <div>
            <select defaultValue={currentStyle} onChange={e => setBaseFontStyle({ style: e.target.value, family: baseFontName.family })}>
                {styles.map(style => (
                    <option
                        key={style.fontName.style}
                        value={style.fontName.style}
                    >{style.fontName.style}</option>
                ))}
            </select>
        </div>
    )
}

export default StyleSwitcher