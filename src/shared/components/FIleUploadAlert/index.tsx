import { useSelector } from "react-redux";
import { PromptMessage } from "../../../enums/types.enum";
import CheckIcon from "../../../ts-icons/CheckIcon.svg";
import CrossIcon from "../../../ts-icons/crossIcon.svg";
import { RootState } from "../../../redux-toolkit/store/store";

const FIleUploadAlert = ({ type, message, removeMessage }: any) => {
    const orientation: any = useSelector((state: RootState) => state.orientation.value);

    const renderAlert = () => {
        if (type === PromptMessage.SUCCESS) {
            return (
                <aside className={`w-full h-[52px] inline-flex items-center px-4 relative bg-green-50 mt-4 shadow-cs-1`}>
                    <div className={`bg-green-400 h-4 w-4 rounded-full inline-grid place-items-center`}><CheckIcon stroke="#fff" /></div>
                    <p className="text-green-800 px-3 text-sm font-medium">{message}</p>
                    <CrossIcon onClick={removeMessage} stroke="#22C55E" className={`absolute top-1/2 translate-y-[-50%] h-5 w-5 cursor-pointer ${orientation === "rtl" ? "left-4" : "right-4"}`} />
                </aside>
            )
        } else if (type === PromptMessage.ERROR) {
            return (
                <aside className={`w-full h-[52px] inline-flex items-center px-4 relative bg-red-300 mt-4`}>
                    <div className={`bg-white h-4 w-4 rounded-full inline-grid place-items-center`}><CrossIcon stroke="rgb(252 165 165)" className="w-4 h-4" /></div>
                    <p className="text-white px-3 text-sm font-medium">{message}</p>
                    <CrossIcon onClick={removeMessage} stroke="#fff" className={`absolute top-1/2 translate-y-[-50%] h-5 w-5 cursor-pointer ${orientation === "rtl" ? "left-4" : "right-4"}`} />
                </aside>
            )
        } else {
            return (
                <aside className={`w-full h-[52px] inline-flex items-center px-4 relative bg-red-300 mt-4`}>
                    <div className={`bg-white h-4 w-4 rounded-full inline-grid place-items-center`}><CrossIcon stroke="rgb(252 165 165)" className="w-4 h-4" /></div>
                    <p className="text-green-800 px-3 text-sm font-medium">{message}</p>
                    <CrossIcon onClick={removeMessage} stroke="#22C55E" className={`absolute top-1/2 translate-y-[-50%] h-5 w-5 cursor-pointer ${orientation === "rtl" ? "left-4" : "right-4"}`} />
                </aside>
            )
        }
    };

    return renderAlert()
};
export default FIleUploadAlert;