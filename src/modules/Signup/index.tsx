import React, { useState, useLayoutEffect, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { toastUtil } from "../../utils/toast.utils";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux-toolkit/store/store";
import { hasLowerCase, hasNumbers, hasSpecialCharacters, hasUpperCase } from "../../utils/regex.utils";
import CheckIcon from "../../ts-icons/CheckIcon.svg";
import EyeIcon from "../../ts-icons/EyeIcon.svg";
import EyeSlash from "../../ts-icons/EyeSlashIcon.svg";
import { signup } from "../../apis/auth.api";
import { KanzRoles } from "../../enums/roles.enum";
import { saveUserData } from "../../redux-toolkit/slicer/user.slicer";
import Button from "../../shared/components/Button";
import { AntdInput } from "../../shared/components/Input";
import GoogleOauth from "../../shared/components/GoogleOauth";
import LinkedInOauth from "../../shared/components/LinkedinOauth";
import ClippedBanner from "../Onboarding/components/ClippedBanner";
import LanguageDrodownWrapper from "../../shared/views/LanguageDrodownWrapper";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const Signup = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const language: any = useSelector((state: RootState) => state.language.value);
  const event: any = useSelector((state: RootState) => state.event.value);
  const orientation: any = useSelector((state: RootState) => state.orientation.value);

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    localStorage.setItem("role", state || KanzRoles.INVESTOR);
  }, []);

  const requiredFieldError = language?.common?.required_field;
  const Form = () => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitSuccessful },
    } = useForm<FormValues>({ defaultValues: { email: "" } });

    const [password, setPassword] = useState("");
    const PasswordStrengthUI = (password: any) => {
      return (
        <div className="inline-flex flex-row items-center justify-center w-full gap-4 mb-6 screen500:flex-col screen500:items-start flex-wrap">
          <section className="inline-flex items-center">
            <div className={`${hasUpperCase(password) ? "checked-background" : "check-background"} rounded-full w-4 h-4 inline-grid place-items-center mr-1`} >
              <CheckIcon fill={`${hasUpperCase(password) ? "#fff" : "rgba(0, 0, 0, 0.3)"}`} />
            </div>
            <small className="text-neutral-500 text-sm font-normal mx-1">
              {language?.onboarding?.upperCase}
            </small>
          </section>
          <section className="inline-flex items-center">
            <div className={`${hasLowerCase(password) ? "checked-background" : "check-background"} check-background rounded-full w-4 h-4 inline-grid place-items-center mr-1`} >
              <CheckIcon fill={`${hasLowerCase(password) ? "#fff" : "rgba(0, 0, 0, 0.3)"}`} />
            </div>
            <small className="text-neutral-500 text-sm font-normal mx-1">
              {language?.onboarding?.lowerCase}
            </small>
          </section>
          <section className="inline-flex items-center">
            <div
              className={`${password.length >= 8 ? "checked-background" : "check-background"
                } check-background rounded-full w-4 h-4 inline-grid place-items-center mr-1`}
            >
              <CheckIcon
                fill={`${password.length >= 8 ? "#fff" : "rgba(0, 0, 0, 0.3)"}`}
              />
            </div>
            <small className="text-neutral-500 text-sm font-normal mx-1">
              {language?.onboarding?.min8}
            </small>
          </section>
          <section className="inline-flex items-center">
            <div
              className={`${hasNumbers(password) ? "checked-background" : "check-background"
                } check-background rounded-full w-4 h-4 inline-grid place-items-center mr-1`}
            >
              <CheckIcon
                fill={`${hasNumbers(password) ? "#fff" : "rgba(0, 0, 0, 0.3)"}`}
              />
            </div>
            <small className="text-neutral-500 text-sm font-normal mx-1">
              {language?.onboarding?.num}
            </small>
          </section>
          <section className="inline-flex items-center">
            <div className={`${hasSpecialCharacters(password) ? "checked-background" : "check-background"} check-background rounded-full w-4 h-4 inline-grid place-items-center mr-1`} >
              <CheckIcon fill={`${hasSpecialCharacters(password) ? "#fff" : "rgba(0, 0, 0, 0.3)"}`} />
            </div>
            <small className="text-neutral-500 text-sm font-normal mx-1">
              {language?.onboarding?.special}
            </small>
          </section>
        </div>
      );
    };

    const onSubmit: SubmitHandler<FormValues> = async (values: any) => {
      const signUpData = { name: values?.name, email: values?.email, password: values?.password, type: state || KanzRoles.INVESTOR, language: event };

      try {
        setLoading(true);
        const { status, data } = await signup({ user: signUpData });
        if (status === 200) {
          dispatch(saveUserData(data.status.data));
          navigate("/verification");

        } else toast.error(language.promptMessages.errorGeneral, toastUtil);
      } catch (error: any) {
        console.error(error);
        const message = error?.response?.data?.status?.message || language.promptMessages.errorGeneral;
        toast.error(message, toastUtil);
      } finally {
        setLoading(false);
      }
    };

    // onchange handler
    const handleChange = (value: any) => {
      setPassword(value);
    };

    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    useEffect(() => {
      const subscription = watch((value) => handleChange(value.password));
      return () => subscription.unsubscribe();
    }, [watch]);

    return (
      <form className="pt-8 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)} {...(isSubmitSuccessful && { noValidate: true })} >
        <div className="mb-4">
          <AntdInput register={register} name="name" label={language?.common?.fullName} type="text" required placeholder="Abdulrahman Mohammad" error={errors.name?.message} // Pass the error message from form validation
            validation={{ required: requiredFieldError}}/>
        </div>
        <div className="my-6 relative">
          <AntdInput register={register} name="email" label={language?.common?.email} type="email" required placeholder="you@example.com" error={errors.email?.message} // Pass the error message from form validation
            validation={{ required: requiredFieldError, pattern: {
                value:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
                message: "Invalid email address",
              },
            }}
          />
        </div>
        <div className="mb-3 relative">
          <AntdInput register={register} name="password" label={language?.common?.password} type={showPassword ? "text" : "password"} required placeholder="**********" error={errors.password?.message} // Pass the error message from form validation
            validation={{ required: requiredFieldError }}
            ShowPasswordIcon={ <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none" onClick={handleTogglePassword} >
                {showPassword ? (
                  <EyeIcon stroke="rgb(64 64 64)" />
                ) : (
                  <EyeSlash stroke="rgb(64 64 64)" />
                )}
              </button>
            }
          />
        </div>
        {PasswordStrengthUI(password)}
        <Button className="w-full h-[38px]" disabled={loading} htmlType="submit" loading={loading} >
          {language?.buttons?.createAccount}
        </Button>
        <div className="flex justify-end my-[12px]">
          <p className="text-neutral-500 text-left">
            {language?.buttons?.alreadyAccount}{" "}
          </p>
          &nbsp;
          <button
            className="text-cyan-800 font-bold cursor-pointer"
            type="button"
            onClick={() => navigate("/login")}
          >
            {language.buttons.signin}
          </button>
        </div>
        <div className="flex items-center justify-center my-[38px]">
          <div className="border-t border-neutral-300 flex-grow"></div>
          <div className="px-4 text-neutral-500 font-normal">
            {language?.onboarding?.orSignIn}
          </div>
          <div className="border-t border-neutral-300 flex-grow"></div>
        </div>

        <aside className="inline-flex items-center justify-between w-full gap-4">
          <GoogleOauth language={language} event={event} loading={loading} setLoading={setLoading} state={state} />
          <LinkedInOauth language={language} event={event} loading={loading} setLoading={setLoading} state={state} />
        </aside>
      </form>
    );
  };
  return (
    <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
      <ClippedBanner />
      <section className="h-full w-[55%] inline-block align-top screen991:w-full overflow-y-auto">
        <aside className="inline-flex flex-col items-center justify-center w-full">
          <section className={`relative w-full top-[26px] ${orientation === "rtl" ? "text-left" : "text-right"}`}>
            <LanguageDrodownWrapper />
          </section>
          <section className="w-[428px] max-w-md pt-[130px] screen500:max-w-[300px]">
            <h2 className="text-[24px] font-bold text-left text-neutral-900 screen500:text-[20px]">
              {language?.onboarding?.createAccount}
            </h2>
            <Form />
          </section>
        </aside>
      </section>
    </main>
  );
};
export default Signup;