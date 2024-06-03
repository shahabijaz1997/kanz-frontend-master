import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux-toolkit/store/store";
import Logo from "../../../../assets/logo.png";
import BellIcon from "../../../../ts-icons/BellIcon.svg";
import { logout } from "../../../../apis/auth.api";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../../../redux-toolkit/slicer/auth.slicer";
import { saveUserData } from "../../../../redux-toolkit/slicer/user.slicer";
import { KanzRoles } from "../../../../enums/roles.enum";
import CrossIcon from "../../../../ts-icons/crossIcon.svg";
import { saveUserMetaData } from "../../../../redux-toolkit/slicer/metadata.slicer";
import LanguageDrodownWrapper from "../../../views/LanguageDrodownWrapper";
import { saveLogo } from "../../../../redux-toolkit/slicer/attachments.slicer";
import { languageDropdownItems } from "../../../../utils/dropdown-items.utils";

const GeneralHeader = ({ responsive = false, showMenu = false, showLanguageDropdown = false }: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language: any = useSelector((state: RootState) => state.language.value);
    const orientation: any = useSelector((state: RootState) => state.orientation.value);
    const authToken: any = useSelector((state: RootState) => state.auth.value);
    const event: any = useSelector((state: RootState) => state.event.value);
    const navigationMenu = [{ id: 1, title: language.header.investment }, { id: 2, title: language.header.startup }, { id: 3, title: language.header.syndicate }, { id: 4, title: language.header.realtor }]
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const onLogout = async () => {
        try {
            await logout(authToken);
        } catch (error: any) {
        } finally {
            dispatch(saveToken(""));
            navigate("/login");
            localStorage.clear();
            dispatch(saveUserData(""));
            dispatch(saveUserMetaData(""));
            dispatch(saveLogo(""));
        }
    };

    const showSelectedDisabled = () => {
        let item = languageDropdownItems.find((lang: any) => lang.name === event);
        return(
            <button type="button" className={`inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-medium hover:bg-gray-50 text-neutral-700 cursor-not-allowed ${orientation === "rtl" ? "w-full justify-end pl-5" : "justify-end"}`} >
               <img className="h-4" src={item?.icon} alt={item?.title} />
                    {item?.title}
                    <svg className="-mr-1 h-5 w-5" viewBox="0 0 20 20" fill="#404040" aria-hidden="true" >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd" />
                    </svg>
            </button>
        )
    };

    const authenticatedHeaderNav = () => {
        if (authToken) {
            return (
                <React.Fragment>
                    <li className="">
                        <div className="rounded-full w-8 h-8 inline-grid place-items-center bell-background cursor-not-allowed">
                            <BellIcon stroke={"#4F4F4F"} />
                        </div>
                    </li>
                    <li onClick={onLogout}>
                        <button className="text-neutral-500 font-medium cursor-pointer text-sm tracking-[0.03em]">{language.buttons.logout}</button>
                    </li>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    {authToken ? (
                        <li onClick={onLogout}>
                            <button className="text-neutral-500 font-medium cursor-pointer text-sm tracking-[0.03em]">{language.buttons.logout}</button>
                        </li>
                    ) : (
                        <React.Fragment>
                            <li onClick={() => navigate("/login")}>
                                <button className="text-neutral-500 cursor-pointer text-sm tracking-[0.03em]">{language.buttons.signin}</button>
                            </li>
                            <li onClick={() => navigate("/signup", { state: KanzRoles.INVESTOR })}>
                                <button className="text-white text-sm tracking-[0.03em] bg-cyan-800 rounded-md focus:outline-none focus:shadow-outline w-full h-[38px] px-3">{language.buttons.getStart}</button>
                            </li>
                        </React.Fragment>
                    )}

                </React.Fragment>
            )
        }
    };

    return (
        <React.Fragment>
            {!responsive ? (
                <div className="container relative mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => navigate("/")}>
                        <img src={Logo} alt="App Logo" />
                    </div>

                    {showMenu && (
                        <nav className="absolute left-1/2 translate-x-[-50%]">
                            <ul className="inline-flex gap-9">
                                {React.Children.toArray(
                                    navigationMenu.map(i => <li className="cursor-pointer transition-all text-neutral-500 text-base font-medium hover:text-neutral-900 hover:underline"><a href={`#${i.title}`}>{i.title}</a></li>)
                                )}
                            </ul>
                        </nav>
                    )}

                    <nav className="">
                        <ul className="inline-flex items-center gap-6">
                            <li className="relative">
                                {showLanguageDropdown ? <LanguageDrodownWrapper /> : showSelectedDisabled()}
                            </li>
                            {authenticatedHeaderNav()}
                        </ul>
                    </nav>
                </div>

            ) : (
                <div className="container mx-auto py-6 flex items-start flex-col">
                    <div className="flex items-center justify-between container px-4">
                        <div className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate("/")}>
                            <img src={Logo} alt="App Logo" />
                        </div>

                        <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline" onClick={toggleMenu}>
                            {isMenuOpen ? (
                                <CrossIcon stroke={"#717171"} className="h-8 w-8" />
                            ) : (
                                <svg className="h-6 w-6 fill-current text-gray-600" viewBox="0 0 24 24" >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4 5h16v2H4V5zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <nav className={`${isMenuOpen ? "block w-full bg-white z-10" : "hidden"}`}>
                        <ul className="flex items-center flex-row-reverse pt-12 w-full justify-between px-4">
                            <li>
                                {showLanguageDropdown ? <LanguageDrodownWrapper /> : showSelectedDisabled()}
                            </li>
                            <li>
                                <div className="rounded-full w-8 h-8 inline-grid place-items-center bell-background cursor-not-allowed">
                                    <BellIcon stroke={"#4F4F4F"} />
                                </div>
                            </li>
                            {authToken ? (
                                <li onClick={onLogout} className="mr-3">
                                    <button className="text-neutral-500 font-medium cursor-pointer text-sm tracking-[0.03em]">{language.buttons.logout}</button>
                                </li>
                            ) : (
                                <li onClick={() => navigate("/signup", { state: KanzRoles.INVESTOR })}>
                                    <button className="text-white text-sm tracking-[0.03em] bg-cyan-800 rounded-md focus:outline-none focus:shadow-outline w-full h-[38px] px-3">{language.buttons.getStart}</button>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            )}
        </React.Fragment>
    )
};
export default GeneralHeader