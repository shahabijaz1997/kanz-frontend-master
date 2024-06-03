import { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { RootState } from "../../../redux-toolkit/store/store";
import Header from "../../../shared/components/Header";
import Modal from "../../../shared/components/Modal";
import { FileType } from "../../../enums/types.enum";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import { toast } from "react-toastify";
import { toastUtil } from "../../../utils/toast.utils";
import CrossIcon from "../../../ts-icons/crossIcon.svg";
import Button from "../../../shared/components/Button";
import { isValidEmail, isValidUrl } from "../../../utils/regex.utils";
import StartupStepper from "./StartupStepper";
import { postCompanyInformation } from "../../../apis/company.api";
import { saveLogo } from "../../../redux-toolkit/slicer/attachments.slicer";
import { removeAttachment } from "../../../apis/attachment.api";
import { isEmpty } from "../../../utils/object.util";
import { getCountries } from "../../../apis/bootstrap.api";
import { KanzRoles } from "../../../enums/roles.enum";
import { RoutesEnums } from "../../../enums/routes.enum";

const StartupFlow = ({ }: any) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language: any = useSelector((state: RootState) => state.language.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const event: any = useSelector((state: RootState) => state.event.value);
  const logo: any = useSelector((state: RootState) => state.attachments.logo.value);
  const metadata: any = useSelector((state: RootState) => state.metadata.value);
  const orientation: any = useSelector((state: RootState) => state.orientation.value);
  const [countries, setCountries] = useState({ all: [], names: [] });

  const [payload, setPayload]: any = useState({
    company: "",
    legal: "",
    country: "",
    market: [],
    web: "",
    address: "",
    business: "",
    name: "",
    email: "",
    raised: "",
    target: "",
    logo: null,
    currency: { label: "AED", value: "AED" }
  });
  const [options] = useState([
    { id: 1, title: language?.buttons?.yes },
    { id: 2, title: language?.buttons?.no },
  ]);
  const [step, setStep]: any = useState();
  const [modalOpen, setModalOpen]: any = useState();
  const [fileType, setFileType] = useState(null);
  const [file, setFile]: any = useState(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if(user.type !== KanzRoles.STARTUP) navigate("/welcome");
    getAllCountries();
    bootstrapPayload();
  }, []);

  useLayoutEffect(() => {
    setStep(Number(params?.id) || 1);
  }, [params]);

  const getAllCountries = async () => {
    setLoading(true);
    try {
      let { status, data } = await getCountries(authToken);
      if (status === 200) {
        let names = data.status.data.map((c: any) => c[event].name);
        setCountries({ all: data.status.data, names });
      }
    } catch (error: any) {
      console.error("Error in countries: ", error);
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: "complete-details" });
      }
    } finally {
      setLoading(false);
    }
  };

  const bootstrapPayload = () => {
    if (isEmpty(metadata?.profile)) {
      let _payload: any = localStorage.getItem("startup");
      if (_payload) setPayload(JSON.parse(_payload));
      if (logo) {
        onGetConvertedToBLOB(JSON.parse(_payload)?.logo);
        setFile(logo);
      };
    } else {
      setPayload({
        company: metadata?.profile?.company_name,
        legal: metadata?.profile?.company_name,
        country: { name: metadata?.profile?.country },
        market: metadata?.profile?.industry_market,
        web: metadata?.profile?.website,
        address: metadata?.profile?.address,
        business: metadata?.profile?.description,
        name: metadata?.profile?.ceo_name,
        email: metadata?.profile?.ceo_email,
        raised: metadata?.profile?.total_capital_raised,
        target: metadata?.profile?.current_round_capital_target,
        logo: metadata?.profile?.logo,
        currency: { label: "AED", value: "AED" }
      })
    }
  };

  const onGetConvertedToBLOB = async (url: string) => {
    try {
      let blob: any = await convertToBlob(url);
      onSetPayload(blob, "logo");
    } catch (error) {
      console.error(error);
    }
  };

  const convertToBlob = async (url: any) => {
    const response = await fetch(url);
    const data = await response.blob();
    return data;
  };


  const onSetFile = (file: File, id: string, url: string, attachment_id: string, size: string, dimensions: string, type: string) => {
    let _file: any = {
      name: file?.name,
      size,
      dimensions
    }
    let _attachment: any = { file: _file, id, url, attachment_id, type: type, original: file };
    setFile(_attachment);
    dispatch(saveLogo(_attachment));
    onSetPayload(file, "logo");
  };

  const removeFile = async (id: string) => {
    dispatch(saveLogo(""));
    setFile(null);
    onSetPayload(null, "logo")
  };

  const ontoNextStep = () => {
    if (step === 1) {
      let errors = [];
      if (!payload.company || !payload.legal || !payload.market.length || !payload.web || !payload.address || !payload.country)
        errors.push(language.promptMessages.pleaseSelectAllData)
      if (!isValidUrl(payload.web)) errors.push(language.promptMessages.validComp);
      toast.dismiss();
      if (errors.length) return errors.forEach(e => toast.warning(e, toastUtil));
      setStep(2);
      navigate(`/startup-type/${step + 1}`);
    } else {
      let errors = [];
      if (!payload.company || !payload.legal || !payload.country || !payload.market.length || !payload.address || !payload.web || !payload.name || !payload.email || !payload.logo || !payload.business || !payload.raised || !payload.target) {
        errors.push(language.promptMessages.pleaseSelectAllData);
      }
      if (!isValidEmail(payload.email)) errors.push(language.promptMessages.invalidEmailCeo)
      toast.dismiss();
      if (errors.length) return errors.forEach(e => toast.warning(e, toastUtil));
      onPostCompanyData();
    }
  };

  const onSetPayload = (data: any, type: string) => {
    setPayload((prev: any) => {
      return { ...prev, [type]: data };
    });
  };

  const onPostCompanyData = async () => {
    try {
      setLoading(true);
      let _country: any = countries.all.find((x: any) => x[event].name === payload.country.name);
      
      const form: any = new FormData();
      form.append("startup[company_name]", payload.company);
      form.append("startup[legal_name]", payload.legal);
      form.append("startup[country_id]", payload.country?.id || _country?.id);
      payload.market.forEach((val: any) => {
        form.append("startup[industry_market][]", val);
      });
      form.append("startup[website]", payload.web);
      form.append("startup[address]", payload.address);
      typeof payload?.logo !== "string" && form.append("startup[logo]", payload?.logo, payload?.logo?.name);
      form.append("startup[description]", payload.business);
      form.append("startup[ceo_name]", payload.name);
      form.append("startup[ceo_email]", payload.email);
      form.append("startup[total_capital_raised]", payload.raised);
      form.append("startup[current_round_capital_target]", payload.target);
      form.append("startup[currency]", payload?.currency?.value);

      let { status } = await postCompanyInformation(form, authToken);

      if (status === 200) {
        navigate("/add-attachments");
        localStorage.setItem("startup", JSON.stringify(payload));
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: "add-attachments" });
      }
      console.error(error);
      const message = error?.response?.data?.status?.message || error?.response?.data || language.promptMessages.errorGeneral;
      toast.error(message, toastUtil);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
      <section>
        <Header custom={true} data={{
          leftMenu: language.header.companyDetails, button: (<button onClick={() => navigate("/welcome")} className="text-neutral-900 bg-white font-bold text-sm w-[150px] h-9 cursor-pointer border border-black shadow-sm screen800:w-[120px]">{language.buttons.gotoDashboard}</button>),
        }}
        />
      </section>

      <aside className="w-[420px] h-full screen500:max-w-[300px] mx-auto py-12">
        <section className="flex items-start justify-center flex-col">
          <h3 className="text-cc-black font-bold text-2xl">
            {language.syndicate.step} {step} {language.drawer.of} 2
          </h3>
          <hr className="h-px w-full mt-4 bg-gray-200 border-0 bg-cbc-grey" />
        </section>

        <StartupStepper
          countries={countries}
          language={language}
          payload={payload}
          onSetPayload={onSetPayload}
          options={options}
          step={step}
          file={file}
          event={event}
          setFileType={(e: any) => setFileType(e)}
          removeFile={removeFile}
          setFile={onSetFile}
          setModalOpen={(e: any) => setModalOpen(e)}
          authToken={authToken}
          orientation={orientation}
        />

        <section className="w-full inline-flex items-center justify-between py-10">
          <Button className="h-[38px] w-[140px]" htmlType="button" type="outlined" onClick={() => {
            if(step === 1) navigate(RoutesEnums.WELCOME);
            else navigate(-1);
          }}>
            {language?.buttons?.back}
          </Button>
          <Button
            className="h-[38px] w-[140px]"
            disabled={loading}
            htmlType="submit"
            loading={loading}
            onClick={ontoNextStep}
          >
            {language?.buttons?.continue}
          </Button>
        </section>
      </aside>

      <Modal show={modalOpen ? true : false}>
        <div
          className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute right-2 top-2"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.078" }}
        >
          <CrossIcon
            stroke="#fff"
            className="w-6 h-6"
            onClick={() => {
              setModalOpen(null);
            }}
          />
        </div>
        {fileType === FileType.IMAGE ? (
          <img src={modalOpen} alt="Img" className="max-h-[100%]" />
        ) : (
          <embed
            src={modalOpen}
            type="application/pdf"
            className="w-[100%] h-[90%]"
          />
        )}
      </Modal>
    </main>
  );
};
export default StartupFlow;