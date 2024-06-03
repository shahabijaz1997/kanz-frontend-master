import { useSelector } from "react-redux";
import CrossIcon from "../../../ts-icons/crossIcon.svg";
import { RootState } from "../../../redux-toolkit/store/store";

const Drawer = ({ children, isOpen, setIsOpen }: any) => {
  const orientation: any = useSelector((state: RootState) => state.orientation.value);

  return (
    <aside className={`mt-[77px] w-[380px] fixed top-0 h-full z-[105] ease-in-out
    ${(isOpen && orientation !== "rtl") && " transition-opacity opacity-100 duration-500 right-12 screen1200:right-6 "}
    ${(isOpen && orientation === "rtl") && " transition-opacity opacity-100 duration-500 left-12 screen1200:left-6"}
    ${(!isOpen && orientation !== "rtl") && " transition-all delay-500 opacity-0 right-[-380px] "}
    ${(!isOpen && orientation === "rtl") && " transition-all delay-500 opacity-0 left-[-380px] "}
    `}>
      <section className={`
      w-full top-1/2 translate-y-[-50%] absolute bg-white h-[80%] shadow-cs-2 delay-400 duration-500 ease-in-out transition-all transform screen1200:w-[300px]
      ${orientation === "rtl" ? "screen500:left-0" : "screen500:right-0"}
      ${(isOpen && orientation !== "rtl") && " right-4 screen1200:right-1"}
      ${(isOpen && orientation === "rtl") && " left-4 screen1200:left-1"}
      ${(!isOpen && orientation !== "rtl") && " right-[-100%] "}
      ${(!isOpen && orientation === "rtl") && " left-[-100%] "}
      `}>
        <article className="relative w-full p-6 flex flex-col space-y-6 overflow-y-auto h-full no-scrollbar">
          <div className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <CrossIcon
              stroke="#171717"
              className="absolute h-6 w-6 right-4 top-4"
            />
          </div>
          {children}
        </article>
      </section>
    </aside>
  );
};
export default Drawer;
