import React from 'react'
import cx from 'classnames'

interface StyleSwitcherProps {
    styles: {
        fontName: {
            family: string,
            style: string
        }
    }[][];
    currentStyle: string;
    setBaseFontStyle: ({ style, family }: { style: string, family: string }) => void;
}

const StyleSwitcher = (props: StyleSwitcherProps) => {
    const { styles, currentStyle, setBaseFontStyle } = props;
    const [showOptions, toggleOptions] = React.useState(false)

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

                    {styles.map((styleGroup, idx) => (
                        <div key={idx}>
                            {styleGroup.map(style => (
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

                            {idx < styles.length - 1 &&
                                <div className="select-menu__divider">
                                    <span className="select-menu__divider-line" />
                                </div>
                            }
                        </div>
                    ))}
                </ul>
            }
        </div >
    )
}

export default StyleSwitcher