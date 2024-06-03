import React from "react";
import Header from "../../../shared/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store/store";


const PrivacyPolicy = () => {
    const language: any = useSelector((state: RootState) => state.language.value);

    return (
        <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
            <section>
                <Header />
            </section>

            <aside className="w-full flex items-center justify-center pt-[75px]">
                <section
                    className="px-9 bg-white inline-flex flex-col py-14 w-1/2 screen991:w-3/4 screen991:w-[90%]"
                    style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)", textAlign: "justify" }}
                >
                    <h2 className="text-xl font-bold text-center text-neutral-900 mb-5 screen500:text-[20px]">
                        {language?.v2?.privacy_policy?.title}
                    </h2>
                    <p className="text-base font-normal text-neutral-700 mt-5 screen500:text-[12px] ">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.privacy_policy?.para_1 }} />
                        <li className="mt-2">
                            {language?.v2?.privacy_policy?.li_1} {language?.v2?.privacy_policy?.link} {language?.v2?.privacy_policy?.li_1a}
                        </li>
                        <li className="mt-2" dangerouslySetInnerHTML={{ __html: language?.v2?.privacy_policy?.li_2 }} />
                    </p>

                    <p className="text-base font-normal text-neutral-700 mt-5 screen500:text-[12px] ">
                        <span dangerouslySetInnerHTML={{ __html: language?.v2?.privacy_policy?.para_2 }} />
                    </p>

                    {
                        language?.v2?.privacy_policy?.content?.map((content: any) => 
                            <React.Fragment>
                                <h3 className="font-bold my-3 screen500:text-[20px]">{content.heading}</h3>
                                <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                                    <div dangerouslySetInnerHTML={{ __html: content.paras }} />
                                </p>
                            </React.Fragment>
                        )
                    }
                    
                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.privacy_policy?.table}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <ul>
                            {language?.v2?.privacy_policy?.table_contents.map((content: any) =>
                                <li>{content.title}</li>
                            )}
                        </ul>
                    </p>
                    {
                        language?.v2?.privacy_policy &&
                        language?.v2?.privacy_policy?.table_contents.map((content: any) =>
                            <React.Fragment>
                                {content.title && <h3 className="font-bold my-3 screen500:text-[20px]">{content.title}</h3>}
                                <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                                    { content.paras?.map((para: string) =>
                                        <div className="mb-2" dangerouslySetInnerHTML={{ __html: para }} />
                                    )}
                                </p>
                                {content.li?.map((item: any) =>
                                    <li dangerouslySetInnerHTML={{__html: item}} />
                                )}
                                {content.additional_content?.map((add_content: any) => 
                                    <React.Fragment>
                                        {
                                            add_content.heading &&
                                            <h3 className="font-bold my-3 screen500:text-[20px]" dangerouslySetInnerHTML={{__html: add_content.heading}} />
                                        }
                                        <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                                            { add_content.paras?.map((para: string) =>
                                                <div className="mb-2" dangerouslySetInnerHTML={{ __html: para }} />
                                            )}
                                        </p>
                                        {add_content.li?.map((item: any) =>
                                            <li dangerouslySetInnerHTML={{__html: item}} />
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )
                    }
                </section>
            </aside>
        </main>
    );
};

export default PrivacyPolicy;