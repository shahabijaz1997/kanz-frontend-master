import Header from "../../../shared/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store/store";


const TermsAndConditions = () => {
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
                        {language?.v2?.terms_conditions?.title}
                    </h2>
                    <p className="text-base font-normal text-neutral-700 mt-5 screen500:text-[12px] ">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_1 }} />
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_2 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_1}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_3 }} />
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_4 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_2}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_5 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_3}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_6 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_4}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_7 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_5}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_8 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_6}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_9 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_7}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_10 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_8}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_11 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_9}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_12 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_10}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_13 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_11}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_14 }} />
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_15 }} />
                    </p>

                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.terms_conditions?.heading_12}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.terms_conditions?.para_16 }} />
                    </p>
                    
                    <h3 className="font-bold my-3 screen500:text-[20px]">
                        {language?.v2?.common?.contact}
                    </h3>
                    <p className="text-base font-normal text-neutral-700 screen500:text-[12px]">
                        <div dangerouslySetInnerHTML={{ __html: language?.v2?.common?.ques_ask }} />
                        <div className="mt-5" dangerouslySetInnerHTML={{ __html: language?.v2?.common?.prim_email }} />
                    </p>
                </section>
            </aside>
        </main>
    );
};

export default TermsAndConditions;