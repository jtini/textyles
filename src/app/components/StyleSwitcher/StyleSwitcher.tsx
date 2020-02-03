import React from 'react'
import cx from 'classnames'

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

    const [showOptions, toggleOptions] = React.useState(false)
    console.log({ showOptions })

    return (
        <div>
            <button
                className="select-menu__button"
                onClick={() => toggleOptions(true)}
                type="button"
            >
                {currentStyle}
            </button>
            {
                showOptions &&
                <ul className="select-menu__list select-menu__list--active">
                    {styles.map(style => (
                        <li
                            onClick={() => {
                                setBaseFontStyle({ style: style.fontName.style, family: style.fontName.family })
                                toggleOptions(false)
                            }}
                            className={cx('select-menu__list-item', {
                                "select-menu__list-item--active": style.fontName.style === currentStyle
                            })}
                            key={style.fontName.style}
                        >
                            <span className="select-menu__list-item-icon" />
                            <span className="select-menu__list-item-text">
                                {style.fontName.style}
                            </span>
                        </li>
                    ))}
                </ul>
            }
            {/* <select
                name="fontStyle"
                id="fontStyle"
                defaultValue={currentStyle}
                onChange={e => setBaseFontStyle({ style: e.target.value, family: baseFontName.family })}
                className="select-menu select-menu__button"
            >
                {styles.map(style => (
                    <option
                        key={style.fontName.style}
                        value={style.fontName.style}
                    >{style.fontName.style}</option>
                ))}
            </select> */}
        </div >
    )
}

export default StyleSwitcher