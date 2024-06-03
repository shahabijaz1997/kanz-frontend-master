import { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState } from "../../redux-toolkit/store/store";
import { useNavigate } from "react-router-dom";
import { confirmToken, resendConfirmToken } from "../../apis/auth.api";
import { toast } from "react-toastify";
import { toastUtil } from "../../utils/toast.utils";
import { saveToken } from "../../redux-toolkit/slicer/auth.slicer";
import { AntdInput } from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { getEnv } from "../../env";
import ClippedBanner from "../Onboarding/components/ClippedBanner";

type FormValues = {
  code: string;
};

let ENV: any = getEnv();
const EmailVerification = ({ }: any) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<FormValues>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language: any = useSelector((state: RootState) => state.language.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const [email] = useState(user?.email);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const requiredFieldError = language?.common?.required_field;

  useLayoutEffect(() => {
    if (user?.profile_states?.account_confirmed) navigate("/welcome");
  }, []);

  const onResendConfirmToken = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { status, data } = await resendConfirmToken({ user: { email } }, authToken);
      if (status === 200) toast.success(data.status.message, toastUtil);
    } catch (error: any) {
      const message =
        error?.response?.data?.status?.message ||
        language.promptMessages.errorGeneral;
      toast.dismiss();
      toast.error(message, toastUtil);
    } finally {
      setLoading(false);
      setToken("");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { code: token } = values;
    try {
      if (!token) return;
      setLoading(true);
      const { status, data, headers }: any = await confirmToken(user.id, { confirmation_token: token, });
      if (status === 200 && headers["authorization"]) {
        const token = headers["authorization"].split(" ")[1];
        dispatch(saveToken(token));
        localStorage.removeItem("role");
        navigate("/welcome");
      }
    } catch (error: any) {
      const message = error?.response?.data?.status?.message || language.promptMessages.invalidCode || language.promptMessages.errorGeneral;
      toast.dismiss();
      toast.error(message, toastUtil);
      if (error?.response?.data?.status?.data?.account_status === "blocked")
        return navigate("/signup");
    } finally {
      setLoading(false);
      setToken("");
    }
  };

  return (
    <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
      <ClippedBanner />
      <section className="h-full w-[55%] inline-block align-top screen991:w-full overflow-y-auto">
        <aside className="inline-flex flex-col items-center justify-center w-full">
          <section className="w-[428px] max-w-md pt-[130px] screen500:max-w-[300px]">
            <h2 className="text-2xl font-bold text-left text-neutral-900 mb-4">
              {language?.onboarding?.verificationCode}
            </h2>
            <h3 className="text-base font-normal text-left text-neutral-700 screen500:text-[12px]">
              {language?.onboarding?.verificationText}
            </h3>
            <form className="pt-8 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <AntdInput register={register} name="code" label={language?.onboarding?.codeText} type="text" required error={errors?.code?.message} // Pass the error message from form validation
                  validation={{ required: requiredFieldError }} />
              </div>
              <div className="-mt-2 text-right text-neutral-500 font-normal text-[14px] screen500:text-[12px]">
                {language?.onboarding?.sentCode} ({email})
                <div className="text-cc-blue cursor-pointer" onClick={onResendConfirmToken}>
                  {language?.buttons?.resendVerification}{" "}
                </div>
              </div>
              <Button className="mt-10 w-full h-[38px]" disabled={loading} htmlType="submit" loading={loading} >
                {language?.buttons?.verify}
              </Button>
            </form>

          </section>
        </aside>
      </section>
    </main>
  );
};

export default EmailVerification;
