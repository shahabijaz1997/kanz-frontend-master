import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux-toolkit/store/store";
import LoginBg from "../../../../assets/login_bg.png";
import QuotesSvg from "../../../../assets/svg/quotes.svg";
import { KanzRoles } from "../../../../enums/roles.enum";

const ClippedBanner = () => {
    const language: any = useSelector((state: RootState) => state.language.value);
    const orientation: any = useSelector((state: RootState) => state.orientation.value);
    let [clipPath, setClipPath] = useState("polygon(0px 0px, 100% 0px, 84% 100%, 0% 100%)");

    useLayoutEffect(() => {
        if (orientation === "rtl") setClipPath("polygon(0px 0%, 100% 0px, 100% 100%, 10% 100%)")
        else setClipPath("polygon(0px 0px, 100% 0px, 84% 100%, 0% 100%)")
    }, [orientation]);

    const showRoleBasedText = () => {
        let type: string | null = localStorage.getItem("role");
        if (type === KanzRoles.REALTOR) {
            return (
                <React.Fragment>
                    <div>{language?.v2?.realtor?.onboardSub_2}</div>
                </React.Fragment>
            )
        } else if (type === KanzRoles.INVESTOR) {
            return (
                <React.Fragment>
                    <div>{language?.v2?.investor?.onboardSub_2}</div>
                    <div>{language?.v2?.investor?.onboardSub_3}</div>
                </React.Fragment>
            )
        } else if (type === KanzRoles.STARTUP) {
            return (
                <React.Fragment>
                    <div>{language?.v2?.startup?.onboardSub_2}</div>
                </React.Fragment>
            )
        } else if (type === KanzRoles.SYNDICATE) {
            return (
                <React.Fragment>
                    <div>{language?.v2?.syndicate?.onboardSub_2}</div>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <div>{language?.v2?.investor?.onboardSub_2}</div>
                <div>{language?.v2?.investor?.onboardSub_3}</div>
            </React.Fragment>
        )
    };

    return (
        <section style={{ clipPath }} className="h-full w-[45%] inline-block align-top relative screen991:hidden">
            <img src={LoginBg} alt={language?.onboarding?.loginBgAlt} className="w-full h-full absolute object-cover" />
            <aside className="bg-white rounded-[20px] w-[65%] h-[250px] absolute left-1/2 translate-x-[-50%] py-[20px] px-[22px] top-[20vh] screen1200:px-[15px]">
                <img src={QuotesSvg} alt={language?.onboarding?.quotes} />
                <div className="relative top-[-20px] px-[20px]">
                    <h2 className="m-0 p-0 text-[36px] font-bold leading-none screen1200:text-[30px] screen1200:text-[22px]">{language?.onboarding?.welcome}</h2>
                    <p className="font-normal pt-[13px] text-[16px] leading-7 tracking-[3%] text-neutral-500 screen1200:text-[13px] screen1200:leading-4 screen1200:leading-2">
                        <div>{language?.drawer?.onboardSub_1}</div>
                        {showRoleBasedText()}
                    </p>
                </div>
            </aside>
        </section>
    )
};
export default ClippedBanner;