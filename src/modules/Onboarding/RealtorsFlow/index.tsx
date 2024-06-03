import { useState, useLayoutEffect, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import { RootState } from "../../../redux-toolkit/store/store";
import { getCountries } from "../../../apis/bootstrap.api";
import Selector from "../../../shared/components/Selector";
import Header from "../../../shared/components/Header";
import Drawer from "../../../shared/components/Drawer";
import Button from "../../../shared/components/Button";
import { toastUtil } from "../../../utils/toast.utils";
import { postRealtorInformation } from "../../../apis/realtor.api";
import Loader from "../../../shared/views/Loader";
import { ApplicationStatus } from "../../../enums/types.enum";
import { isEmpty } from "../../../utils/object.util";
import { KanzRoles } from "../../../enums/roles.enum";
import { RoutesEnums } from "../../../enums/routes.enum";

type FormValues = {
  noOfProperty: number;
};

const Realtors = (props: any) => {
  const { disabled } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language: any = useSelector((state: RootState) => state.language.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const event: any = useSelector((state: RootState) => state.event.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const metadata: any = useSelector((state: RootState) => state.metadata.value);

  const [isOpen, setOpen]: any = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [countries, setCountries] = useState({ all: [], names: [] });
  const [payload, setPayload]: any = useState({
    national: "",
    residence: "",
    noOfProperty: "",
  });
  const requiredFieldError = language?.common?.required_field;

  useLayoutEffect(() => {
    setLoad(true);
    if ((user.status !== ApplicationStatus.OPENED && user.status !== ApplicationStatus.REOPENED)) return navigate("/welcome");
    let _payload: any = localStorage.getItem("realtor");
    if (_payload) setPayload(JSON.parse(_payload));
    if (!isEmpty(metadata.profile)) {
      setPayload({
        national: { label: metadata.profile[event]?.nationality, value: metadata.profile[event]?.nationality },
        residence: { label: metadata.profile[event]?.residence, value: metadata.profile[event]?.residence },
        noOfProperty: metadata.profile?.no_of_properties
      });
    }
    setLoad(false);
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  useLayoutEffect(() => {
    if (user.type !== KanzRoles.REALTOR) navigate("/welcome");

    getAllCountries();
  }, []);

  useEffect(() => {
    const subscription = watch((value) =>
      onSetPayload(value.noOfProperty, "noOfProperty")
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const getAllCountries = async () => {
    try {
      setLoad(true);
      let { status, data } = await getCountries(authToken);
      if (status === 200) {
        let names = data.status.data.map((c: any) => c[event].name);
        setCountries({ all: data.status.data, names });
      }
    } catch (error) {
      console.error("Error while getting countries: ", error);
    } finally {
      setLoad(false);
    }
  };

  const onSetPayload = (data: any, type: string) => {
    setPayload((prev: any) => {
      return { ...prev, [type]: data };
    });
  };

  const _countries = countries.names?.map((item: any) => {
    return {
      label: item,
      value: item,
    };
  });

  const onSubmit: SubmitHandler<FormValues> = async () => {
    if (!payload.national || !payload.residence || !payload.noOfProperty) {
      toast.dismiss();
      return toast.warning(language.promptMessages.pleaseSelectAllData, toastUtil);
    }
    try {
      setLoading(true);

      let country: any = countries.all.find((c: any) => c[event].name === payload?.national?.value);
      let residence: any = countries.all.find((c: any) => c[event].name === payload?.residence?.value);

      let pData: any = {
        realtor_profile: {
          nationality_id: country.id,
          residence_id: residence.id,
          no_of_properties: payload?.noOfProperty,
        },
      };
      let { status } = await postRealtorInformation(pData, authToken);
      if (status === 200) {
        localStorage.setItem("realtor", JSON.stringify(payload));
        navigate("/add-attachments");
      }
    } catch (error: any) {
      const message = error?.response?.data?.status?.message || error?.response?.data || language.promptMessages.errorGeneral;
      toast.error(message, toastUtil);
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: "realtor-type" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
      <section className="h-[67px]">
        <Header />
      </section>
      {
        load ? (
          <Loader />
        ) : (
          <form className="pb-8 mb-4 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-center">
              <div>
                <div className="w-[450px] mt-[78px]">{language?.v2?.realtor?.add_title}</div>
                <p className="text-neutral-500 font-normal text-sm">
                  <span>{language.onboarding.realtorSubDetail}</span>&nbsp;
                  <span className="text-cc-blue font-medium cursor-pointer" onClick={() => setOpen(true)}>
                    {language.common.learn}
                  </span>
                </p>
                <div className="bg-cbc-grey-sec pb-[18px]  pl-[18px] pr-[18px] pt-2.5 mt-[13px] rounded-[8px]">
                  <section className="mb-4 w-full">
                    <label className="mb-2 block text-neutral-700 text-sm font-medium mb-1" htmlFor="name">
                      {language?.common?.national}
                    </label>
                    <div className="relative w-full" style={{ zIndex: 101 }}>
                      <Selector disabled={disabled} value={payload?.national} options={_countries && _countries} onChange={(v: any) => onSetPayload(v, "national")} defaultValue={payload?.national} />
                    </div>
                  </section>
                  <section className="mb-4 w-full">
                    <label className="mb-2 block text-neutral-700 text-sm font-medium mb-1" htmlFor="full-name" >
                      {language?.v2?.realtor?.country_of_res}
                    </label>
                    <div className="relative w-full" style={{ zIndex: 100 }}>
                      <Selector disabled={disabled} value={payload?.residence} options={_countries && _countries} onChange={(v: any) => onSetPayload(v, "residence")} defaultValue={payload?.residence} />
                    </div>
                  </section>
                  <section className="w-full">
                    <label className="mb-2 block text-neutral-700 text-sm font-medium mb-1" htmlFor="full-name" >
                      {language?.common?.NoOfProperty}
                    </label>
                    <div className="relative w-full" style={{ zIndex: 99 }}>
                      <input value={payload?.noOfProperty} onChange={(e) => onSetPayload(e.target.value, "noOfProperty")} placeholder={language.common.NoOfProperty} className=" h-[42px] shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline" type="text" />
                    </div>
                  </section>
                </div>
                <section className="w-full inline-flex items-center justify-between mt-16">
                  <Button className="mt-6 h-[38px] w-[140px]" type="outlined" htmlType="button" onClick={() => navigate(RoutesEnums.WELCOME)}>
                    {language?.buttons?.back}
                  </Button>
                  <Button className="mt-6 h-[38px] w-[140px]" disabled={loading} htmlType="submit" loading={loading}>
                    {language?.buttons?.continue}
                  </Button>
                </section>
              </div>
            </div>
          </form>
        )
      }
      <Drawer isOpen={isOpen} setIsOpen={(val: boolean) => setOpen(val)}>
        <div className="z-[103px]">
          <header className="font-bold text-xl">
            {language.philosophyGoals.objective}
          </header>
          <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.realtor}</p>
        </div>
      </Drawer>
    </main>
  );
};
export default Realtors;
