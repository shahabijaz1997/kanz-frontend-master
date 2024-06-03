import React, { useState, useLayoutEffect, useRef } from "react";
import Chevrond from "../../../../ts-icons/chevrond.svg";
import HoverModal from "../../../../shared/components/HoverModal";
import FileUpload from "../../../../shared/components/FileUpload";
import SampleImage from "../../../../assets/example_id.png";
import SampleImage_2 from "../../../../assets/example_id_2.png";
import { getAllIndustries, getAllRegions } from "../../../../apis/bootstrap.api";
import SearchedItems from "../../../../shared/components/SearchedItems";
import CrossIcon from "../../../../ts-icons/crossIcon.svg";
import { isEmpty } from "../../../../utils/object.util";
import EditIcon from "../../../../ts-icons/editIcon.svg";

const SyndicateStepper = ({ orientation, language, metadata, payload, file, onSetPayload, options, step, removeFile, setFile, setModalOpen, setFileType, authToken }: any) => {
    const refInd: any = useRef(null);
    const refReg: any = useRef(null);
    const [selected, setSelected]: any = useState(null);
    const [showHoverModal, setShowHoverModal] = useState(false);
    const [search, setSearch] = useState({ industry: "", region: "" });
    const [showData, setShowData] = useState({ industry: false, region: false });
    const [searchResults, setSearchResults]: any = useState({ industry: [], region: [] });

    useLayoutEffect(() => {
        bootstrapData();
    }, []);

    useLayoutEffect(() => {
        selected && onSetPayload(selected?.id === 1 ? true : false, "raised")
    }, [selected]);

    useLayoutEffect(() => {
        const handleClickOutside = (event: any) => {
            if (refInd.current && !refInd.current.contains(event.target)) {
                setShowData(p => {
                    return { ...p, industry: false };
                });
            }
        };

        const handleClickOutsideRegion = (event: any) => {
            if (refReg.current && !refReg.current.contains(event.target)) {
                setShowData(p => {
                    return { ...p, region: false };
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutsideRegion);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutsideRegion);
        };
    }, []);

    const onSetSearch = (data: any, type: string) => {
        setSearch((prev: any) => {
            return { ...prev, [type]: data };
        });
    };

    const bootstrapData = async () => {
        try {
            let { status, data } = await getAllIndustries(authToken);
            if (status === 200)
                setSearchResults((p: any) => { return { ...p, industry: data?.status?.data } });

            let regionRes: any = await getAllRegions(authToken);
            if (regionRes.status === 200)
                setSearchResults((p: any) => { return { ...p, region: regionRes?.data?.status?.data } });

            if (!isEmpty(metadata?.profile)) {
                if (metadata?.profile?.have_you_ever_raised) setSelected(options[0]);
                else if (!metadata?.profile?.have_you_ever_raised) (setSelected(options[1]));
            }
            else {
                if (payload.raised && typeof payload.raised == "boolean") setSelected(options[0]);
                else if (!payload.raised && typeof payload.raised == "boolean") (setSelected(options[1]));
            }
        } catch (error) {
            console.error("Error in industries: ", error);
        }
    };

    return (
        step === 1 ? (
            <section className="flex items-start justify-center flex-col">
                <form className="pt-8 mb-4 w-full">
                    <div className="mb-8 relative">
                        <h3 className="text-neutral-700 text-sm font-medium">{language.syndicate.raisedBefore}</h3>
                        <section className="w-full inline-flex items-center justify-between gap-5">
                            {React.Children.toArray(
                                options.map((opt: any) => {
                                    return (
                                        <li className={`h-[50px] rounded-md w-[420px] p-4 grey-neutral-200 text-sm font-medium cursor-pointer border border-grey inline-flex items-center justify-start screen500:w-full ${selected?.id === opt.id ? "check-background" : "bg-white"}`}
                                            onClick={() => setSelected(opt)}>
                                            <input
                                                type="radio" checked={selected?.id === opt.id ? true : false}
                                                className="accent-cyan-800 relative float-left mx-2 h-3 w-3 rounded-full border-2 border-solid border-cyan-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04]"
                                            />
                                            <small>{opt.title}</small>
                                        </li>
                                    )
                                })
                            )}
                        </section>
                    </div>
                    {selected && selected.id === options[0].id && (
                        <div className="mb-8 relative">
                            <h3 className="block text-neutral-700 text-sm font-medium mb-1">{language.syndicate.addDetail}</h3>
                            <section className="w-full mt-2 p-[18px] rounded-lg check-background border border-grey">
                                <div className="mb-5">
                                    <label htmlFor="raised" className="text-neutral-700 text-sm font-medium">{language.syndicate.raisedQ}</label>
                                    <input id="raised" value={payload?.amountRaised} onChange={(e) => {
                                        const enteredValue = e.target.value;
                                        const numericValue = enteredValue.replace(/[^0-9]/g, '');
                                        onSetPayload(numericValue, "amountRaised");
                                    }} placeholder="101-500" className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                </div>
                                <div>
                                    <label htmlFor="times" className="text-neutral-700 text-sm font-medium">{language.syndicate.timesQ}</label>
                                    <input id="times" value={payload?.timesRaised} onChange={(e) => {
                                        const enteredValue = e.target.value;
                                        const numericValue = enteredValue.replace(/[^0-9]/g, '');
                                        onSetPayload(numericValue, "timesRaised");
                                    }} placeholder="12" className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                                </div>
                            </section>
                        </div>
                    )}

                    <div className="mb-8" ref={refInd}>
                        <label className="block text-neutral-700 text-sm font-medium mb-1" htmlFor="industry">{language.syndicate.industry}</label>
                        <span className="relative">
                            <input id="industry" autoComplete="off" value={search.industry} onChange={(e) => onSetSearch(e.target.value, "industry")} onClick={() => setShowData(p => { return { ...p, industry: !p.industry } })}
                                className="h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                            <span className={`absolute top-[0px] flex items-center pr-2 pointer-events-none ${orientation === "rtl" ? "left-1" : "right-0"}`} style={{ zIndex: 99 }}>
                                <Chevrond stroke="#737373" />
                            </span>
                        </span>
                        {payload.industry && payload.industry.length > 0 && (
                            <aside className="inline-flex gap-2 flex-wrap min-h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline">
                                {React.Children.toArray(
                                    payload.industry.map((ind: any) => <div className="check-background rounded-[4px] px-1 py-[2px] inline-flex items-center">
                                        <small>{ind}</small>
                                        <CrossIcon onClick={() => {
                                            let payloadItems = payload.industry.filter((x: any) => x !== ind)
                                            onSetPayload(payloadItems, "industry");
                                        }} className="cursor-pointer h-5 w-5 ml-1" stroke={"#828282"} />
                                    </div>)
                                )}
                            </aside>
                        )}
                        {(showData.industry) && <SearchedItems items={searchResults.industry} searchString={search.industry} passItemSelected={(it: any) => {
                            let payloadItems = [...payload.industry];
                            payloadItems.push(it);
                            onSetPayload(Array.from(new Set(payloadItems)), "industry");
                        }} />}
                    </div>

                    <div className="mb-8 relative" ref={refReg}>
                        <label className="block text-neutral-700 text-sm font-medium mb-1" htmlFor="region">{language.syndicate.region}</label>
                        <span className="relative">
                            <input id="region" autoComplete="off" value={search.region} onChange={(e) => onSetSearch(e.target.value, "region")} onClick={() => setShowData(p => { return { ...p, region: !p.region } })}
                                className="h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                            <span className={`absolute top-[0px] flex items-center pr-2 pointer-events-none ${orientation === "rtl" ? "left-1" : "right-0"}`} style={{ zIndex: 99 }}>
                                <Chevrond stroke="#737373" />
                            </span>
                        </span>
                        {payload.region && payload.region.length > 0 && (
                            <aside className="inline-flex gap-2 flex-wrap min-h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline">
                                {React.Children.toArray(
                                    payload.region.map((ind: any) => <div className="check-background rounded-[4px] px-1 py-[2px] inline-flex items-center">
                                        <small>{ind}</small>
                                        <CrossIcon onClick={() => {
                                            let payloadItems = payload.region.filter((x: any) => x !== ind)
                                            onSetPayload(payloadItems, "region");
                                        }} className="cursor-pointer h-5 w-5 ml-1" stroke={"#828282"} />
                                    </div>)
                                )}
                            </aside>
                        )}
                        {(showData.region) && <SearchedItems items={searchResults.region} searchString={search.region} passItemSelected={(it: any) => {
                            let payloadItems = [...payload.region];
                            payloadItems.push(it);
                            onSetPayload(Array.from(new Set(payloadItems)), "region");
                        }} />}
                    </div>

                    <div className="mb-8 relative">
                        <label className="block text-neutral-700 text-sm font-medium mb-1" htmlFor="link">{language.syndicate.profile}</label>
                        <div className="relative inline-flex w-full">
                            <input type="disabled" value={"https://"}
                                className={`text-neutral-500 text-base font-normal check-background border-t border-b border-neutral-300 h-[42px] w-[70px] ${orientation === "rtl" ? "border-r rounded-br-md rounded-tr-md pr-2" : "border-l rounded-bl-md rounded-tl-md pl-2"}`} />
                            <input id="link" value={payload?.profileLink} onChange={(e) => onSetPayload(e.target.value, "profileLink")} placeholder="www.example.com"
                                className={`h-[42px] shadow-sm appearance-none border border-neutral-300 w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline ${orientation === "rtl" ? " rounded-bl-md rounded-tl-md" : " rounded-br-md rounded-tr-md"}`} type="text" />
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-neutral-700 text-sm font-medium mb-1" htmlFor="dealflow">{language.syndicate.dealflow}</label>
                        <input id="dealflow" value={payload?.dealflow} onChange={(e) => onSetPayload(e.target.value, "dealflow")} placeholder={language.syndicate.dealflow} className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                    </div>
                </form>

            </section>
        ) : (
            <section className="flex items-start justify-center flex-col">
                <form className="pt-8 mb-4 w-full">
                    <section className="mb-8">
                        <label htmlFor="syndname" className="text-neutral-700 text-sm font-medium">{language.syndicate.syndName}</label>
                        <input id="syndname" value={payload?.name} onChange={(e) => onSetPayload(e.target.value, "name")} placeholder="Abdulrahman Mohammad" className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                    </section>
                    <section className="mb-8">
                        <label htmlFor="tagline" className="text-neutral-700 text-sm font-medium">{language.syndicate.tagline}</label>
                        <input id="tagline" value={payload?.tagline} onChange={(e) => onSetPayload(e.target.value, "tagline")} placeholder={language.syndicate.tagline} className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                    </section>

                    <div className="mb-4 w-full">
                        <div className="text-neutral-700 text-sm font-medium">{language.syndicate.logo}</div>
                        <small className="text-neutral-500 font-normal">{language.syndicate.uploadCompLogo}</small>
                        <small className="relative font-normal text-cc-blue cursor-pointer" onMouseEnter={() => setShowHoverModal(true)} onMouseLeave={() => setShowHoverModal(false)}>
                            &nbsp;<span>{language.common.example}</span>
                            {showHoverModal && (
                                <HoverModal>
                                    <section className="inline-flex flex-row items-center justify-evenly h-full">
                                        <img src={SampleImage_2} alt={language.syndicate.logo} className="max-h-[90px]" />
                                        <img src={SampleImage} alt={language.syndicate.logo} className="max-h-[140px]" />
                                    </section>
                                </HoverModal>
                            )}
                        </small>

                        {
                            payload.logo && typeof payload.logo === "string" ? (
                                <div className="main-embed w-[300px] h-[200px] overflow-hidden relative">
                                    <EditIcon stroke="#fff" className="w-7 h-7 absolute right-2 top-2 cursor-pointer rounded-md p-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.078)" }} onClick={() => onSetPayload(null, "logo")} />
                                    <img src={payload.logo} className="block w-[110%] h-[110%] overflow-hidden" />
                                </div>
                            ) : (
                                <FileUpload uploadDirect={false} id={'logo'} title={'Logo'} file={file} setFile={setFile} removeFile={removeFile} setModalOpen={(e: any) => {
                                    setModalOpen(e.open ? e.url : null);
                                    e.type && setFileType(e.type);
                                }} />
                            )
                        }

                    </div>
                </form>
            </section>
        )
    )
}

export default SyndicateStepper;