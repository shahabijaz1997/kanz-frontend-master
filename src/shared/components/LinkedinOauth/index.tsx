import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LinkedIn } from "react-linkedin-login-oauth2";
import LinkedinIcon from "../../../assets/icons/linedin_logo.png";
import { getEnv } from "../../../env";
import { linkedInOauth } from "../../../apis/auth.api";
import { toastUtil } from "../../../utils/toast.utils";
import { saveUserData } from "../../../redux-toolkit/slicer/user.slicer";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import { KanzRoles } from "../../../enums/roles.enum";
import { saveEvent } from "../../../redux-toolkit/slicer/event.slicer";

const ENV: any = getEnv();

const LinkedInOauth = ({ event, language, setLoading, state }: any) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLinkedInLoginSuccess = async (code: any) => {
        try {
            if (localStorage.getItem("oauth_ld")) return;
            localStorage.setItem("oauth_ld", "PxhYfeh76BH")
            setLoading(true);
            let payload: any = { code, type: state || KanzRoles.INVESTOR, language: event }

            let { status, data, headers } = await linkedInOauth(payload);
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
                    setLoading(false);
                    navigate("/welcome");
                }, 1000)
            }
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.status?.message || language.promptMessages.errorGeneral;
            toast.error(message, toastUtil);
            setLoading(false);
        }
    };

    return (
        <LinkedIn clientId={ENV.LINKEDIN_API_KEY} onSuccess={handleLinkedInLoginSuccess} onError={(err) => console.log(err)} redirectUri={`${window.location.origin}/linkedin`} scope={'r_emailaddress r_liteprofile'}>
            {({ linkedInLogin }) => (
                <button className="transition-all hover:border-cyan-800 border border-neutral-300 rounded-md py-2.5 px-4 w-2/4 h-[38px] inline-grid place-items-center bg-white" type="button" onClick={linkedInLogin}>
                    <img src={LinkedinIcon} alt={language?.onboarding?.linkedinLogin} />
                </button>
            )}
        </LinkedIn>

    )
};
export default LinkedInOauth;