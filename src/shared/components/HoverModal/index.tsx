import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store/store";

const HoverModal = ({ children }: any) => {
    const orientation: any = useSelector((state: RootState) => state.orientation.value);

    return (
        <aside className={`w-[280px] h-[180px] absolute top-[-10px] transition-all ${orientation === "rtl" ? "right-[60px] left-0": "left-[83px] right-0"}`} style={{zIndex: 99}}>
            <div className={`h-3 w-3 absolute top-[15px] bg-white z-[50] bg-cbc-1 border-l-2 border-b-2 border-cyan-800 ${orientation === "rtl" ? "right-[-5px] rotate-[225deg]" : "left-[-6px] rotate-[45deg]"}`}></div>
            <article className="relative w-full p-3 flex flex-col bg-cbc-1 border-2 border-cyan-800 rounded-md space-y-6 overflow-y-auto h-full">
                {children}
            </article>
        </aside>
    )
};
export default HoverModal;
