import { useGoogleLogin } from "@react-oauth/google";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleOauth } from "../../../apis/auth.api";
import { saveUserData } from "../../../redux-toolkit/slicer/user.slicer";
import { toastUtil } from "../../../utils/toast.utils";
import { KanzRoles } from "../../../enums/roles.enum";
import GoogleIcon from "../../../assets/icons/google_logo.png";
import { saveEvent } from "../../../redux-toolkit/slicer/event.slicer";

const GoogleOauth = ({ event, setLoading, language, state }: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                let payload: any = { ...tokenResponse, type: state || KanzRoles.INVESTOR, language: event }
                let { data, status, headers } = await googleOauth(payload);

                if (status === 200) {
                    dispatch(saveUserData(data?.status?.data));
                    const token = headers["authorization"].split(" ")[1];
                    dispatch(saveToken(token));
                    toast.dismiss();
                    toast.success(data.status.message, toastUtil);
                    dispatch(saveEvent(data?.status?.data?.language));
                    localStorage.removeItem("role");
                    let timeout = setTimeout(() => {
                        clearTimeout(timeout);
                        navigate("/welcome");
                    }, 1000)
                }

            } catch (error: any) {
                console.error(error);
                const message = error?.response?.data?.status?.message || language.promptMessages.errorGeneral;
                toast.error(message, toastUtil);
            } finally {
                setLoading(false)
            }
        }
    });

    return (
        <button className="transition-all hover:border-cyan-800 border border-neutral-300 rounded-md py-2.5 px-4 w-2/4 h-[38px] inline-grid place-items-center bg-white" type="button" onClick={() => login()}>
            <img src={GoogleIcon} alt={language?.onboarding?.googleLogin} />
        </button>
    )
};
export default GoogleOauth;