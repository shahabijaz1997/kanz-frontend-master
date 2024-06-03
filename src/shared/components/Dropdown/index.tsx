import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux-toolkit/store/store';

const Dropdown = (props: any) => {
    const { style, dropdownItems, onSetSelected } = props;
    const event: any = useSelector((state: RootState) => state.event.value);
    const orientation: any = useSelector((state: RootState) => state.orientation.value);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef: any = useRef(null);
    const [selected, setSelected] = useState(dropdownItems[0]);

    useLayoutEffect(() => {
        let item = dropdownItems.find((x: any) => x.name === event);
        setSelected(item || dropdownItems[0]);
    }, [event]);

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`relative w-full ${style}`} ref={dropdownRef}>
            <div>
                <button type="button" className={`inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-medium hover:bg-gray-50 text-neutral-700 ${orientation === "rtl" ? "w-full justify-end pl-5" : "justify-end"}`}
                    id="menu-button" aria-expanded={isOpen} aria-haspopup="true" onClick={handleToggleDropdown} >
                    {selected.icon && <img className="h-4" src={selected?.icon} alt={selected.title} />}
                    {selected.title}
                    <svg
                        className="-mr-1 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="#404040"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className={`absolute z-10 min-w-[110px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${orientation === "rtl" ? "left-6 origin-top-left" : "right-6 origin-top-right"}`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1 inline-flex justify-start items-start w-full flex-col" role="none">
                        {React.Children.toArray(
                            dropdownItems.map((item: any) => {
                                return (
                                    <button className={`text-gray-700 px-4 py-1.5 text-sm inline-flex items-center w-full cursor-pointer gap-2 hover:bg-cbc-transparent ${orientation === "rtl" && "justify-end"}`} role="menuitem" tabIndex={-1} id="menu-item-0" onClick={() => {
                                        setSelected(item)
                                        setIsOpen(false);
                                        onSetSelected(item);
                                    }}>
                                        {item.icon && <img src={item.icon} alt={item.title} className="h-4 object-contain" />}
                                        <small className="text-[14px] font-medium">{item.title}</small>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
