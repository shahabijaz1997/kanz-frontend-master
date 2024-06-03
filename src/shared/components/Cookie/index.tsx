import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store/store";
import Button from "../Button";

const Cookie = ({ }: any) => {
    const language: any = useSelector((state: RootState) => state.language.value);
    const token: any = useSelector((state: RootState) => state.auth.value);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    // removeCookie('token', { path: '/' });

    const onAllowCookie = () => {
        setCookie('token', token, { path: '/' });
    };

    const onDiableCookie = () => {
        setCookie('token', false, { path: '/' });
    };

    return (
        !cookies.token ? (<aside className="bg-white fixed bottom-0 h-[100px] w-full shadow-cs-1 border-tl-md border-tr-md px-4">
            <section className="w-full h-full flex justify-between items-center">
                <p className="text-neutral-800 text-sm font-normal w-[60%]">{language?.v2?.cookie_policy?.welcome_cookie_message}</p>
                <div className="btn-container w-[40%] inline-flex gap-2 justify-end">
                    <Button className="text-sm" onClick={onAllowCookie}>{language?.v2?.buttons?.allow}</Button>
                    <Button className="text-sm" onClick={onDiableCookie}>{language?.v2?.buttons?.disable}</Button>
                    <Button className="border-2 border-cyan-800 bg-white !text-cyan-800 text-sm hover:bg-white">{language?.v2?.buttons?.customize}</Button>
                </div>
            </section>
        </aside>) : <aside></aside>
    )
};
export default Cookie;