import { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { RootState } from "../../../redux-toolkit/store/store";
import Header from "../../../shared/components/Header";
import SyndicateStepper from "./SyndicateStepper";
import Modal from "../../../shared/components/Modal";
import { FileType } from "../../../enums/types.enum";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import { toast } from "react-toastify";
import { toastUtil } from "../../../utils/toast.utils";
import CrossIcon from "../../../ts-icons/crossIcon.svg";
import { postSyndicateInformation } from "../../../apis/syndicate.api";
import Button from "../../../shared/components/Button";
import { isValidUrl } from "../../../utils/regex.utils";
import { saveLogo } from "../../../redux-toolkit/slicer/attachments.slicer";
import { isEmpty } from "../../../utils/object.util";
import { KanzRoles } from "../../../enums/roles.enum";
import { RoutesEnums } from "../../../enums/routes.enum";

const SyndicateFlow = ({ }: any) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language: any = useSelector((state: RootState) => state.language.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const logo: any = useSelector((state: RootState) => state.attachments.logo.value);
  const metadata: any = useSelector((state: RootState) => state.metadata.value);
  const orientation: any = useSelector((state: RootState) => state.orientation.value);

  const [payload, setPayload]: any = useState({
    raised: null,
    amountRaised: "",
    timesRaised: "",
    industry: [],
    region: [],
    profileLink: "",
    dealflow: "",
    name: "",
    tagline: "",
    logo: null
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
    if (user.type !== KanzRoles.SYNDICATE) navigate("/welcome");

    bootstrapPayload();
  }, []);

  useLayoutEffect(() => {
    setStep(Number(params?.id) || 1);
  }, [params]);

  const bootstrapPayload = () => {
    if (isEmpty(metadata?.profile)) {
      let _payload: any = localStorage.getItem("syndicate");
      if (_payload) setPayload(JSON.parse(_payload));
      if (logo) {
        onGetConvertedToBLOB(JSON.parse(_payload)?.logo);
        setFile(logo);
      };
    } else {
      setPayload({
        raised: metadata?.profile?.have_you_ever_raised,
        amountRaised: metadata?.profile?.raised_amount,
        timesRaised: metadata?.profile?.no_times_raised,
        industry: metadata?.profile?.industry_market,
        region: metadata?.profile?.region,
        profileLink: metadata?.profile?.profile_link,
        dealflow: metadata?.profile?.dealflow,
        name: metadata?.profile?.name,
        tagline: metadata?.profile?.tagline,
        logo: metadata?.profile?.logo,
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
      if ((payload.raised && (!payload.timesRaised || !payload.amountRaised)) || !payload.industry.length || !payload.region.length || !payload.profileLink || !payload.dealflow)
        errors.push(language.promptMessages.pleaseSelectAllData)
      if (!isValidUrl(payload.profileLink)) errors.push(language.promptMessages.validProfile);
      toast.dismiss();
      if (errors.length) return errors.forEach(e => toast.warning(e, toastUtil));
      setStep(2);
      navigate(`/syndicate-lead/${step + 1}`);
    } else {
      if ((payload.raised && (!payload.timesRaised || !payload.amountRaised)) ||
        !payload.industry.length ||
        !payload.region.length ||
        !payload.profileLink ||
        !payload.dealflow ||
        !payload.name ||
        !payload.tagline ||
        !payload.logo
      ) {
        toast.dismiss();
        return toast.warning(
          language.promptMessages.pleaseSelectAllData,
          toastUtil
        );
      }
      onPostSyndicateData();
    }
  };

  const onSetPayload = (data: any, type: string) => {
    setPayload((prev: any) => {
      return { ...prev, [type]: data };
    });
  };

  const onPostSyndicateData = async () => {
    try {
      setLoading(true);
      const form: any = new FormData();
      form.append("syndicate_profile[have_you_ever_raised]", payload.raised);
      form.append("syndicate_profile[raised_amount]", payload.amountRaised);
      form.append("syndicate_profile[no_times_raised]", payload.timesRaised);
      payload.industry.forEach((val: any) => {
        form.append("syndicate_profile[industry_market][]", val);
      });
      payload.region.forEach((val: any) => {
        form.append("syndicate_profile[region][]", val);
      });
      form.append("syndicate_profile[profile_link]", payload.profileLink);
      form.append("syndicate_profile[dealflow]", payload.dealflow);
      form.append("syndicate_profile[name]", payload.name);
      form.append("syndicate_profile[tagline]", payload.tagline);
      typeof payload?.logo !== "string" && form.append("syndicate_profile[logo]", payload?.logo, payload?.logo?.name);

      let { status } = await postSyndicateInformation(form, authToken);

      if (status === 200) {
        navigate("/add-attachments");
        localStorage.setItem("syndicate", JSON.stringify(payload));
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: "add-attachments" });
      }
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
          leftMenu: language.header.syndicateLead, button: (<button onClick={() => navigate("/welcome")} className="text-neutral-900 bg-white font-bold text-sm w-[150px] h-9 cursor-pointer border border-black shadow-sm screen800:w-[120px]">{language.buttons.gotoDashboard}</button>),
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

        <SyndicateStepper
          metadata={metadata}
          language={language}
          payload={payload}
          file={file}
          onSetPayload={onSetPayload}
          options={options}
          step={step}
          setFileType={(e: any) => setFileType(e)}
          removeFile={removeFile}
          setFile={onSetFile}
          setModalOpen={(e: any) => setModalOpen(e)}
          orientation={orientation}
          authToken={authToken}
        />

        <section className="w-full inline-flex items-center justify-between py-10">
          <Button className="h-[38px] w-[140px]" htmlType="button" type="outlined" onClick={() => {
            if (step === 1) navigate(RoutesEnums.WELCOME);
            else navigate(-1);
          }}
          >
            {language?.buttons?.back}
          </Button>
          <Button className="h-[38px] w-[140px]" disabled={loading} htmlType="submit" loading={loading} onClick={ontoNextStep}>
            {language?.buttons?.continue}
          </Button>
        </section>
      </aside>

      <Modal show={modalOpen ? true : false}>
        <div className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute right-2 top-2" style={{ backgroundColor: "rgba(0, 0, 0, 0.078" }}>
          <CrossIcon className="w-6 h-6" onClick={() => setModalOpen(null)} />
        </div>
        {fileType === FileType.IMAGE ? (
          <img src={modalOpen} alt="Img" className="max-h-[100%]" />
        ) : (
          <embed src={modalOpen} type="application/pdf" className="w-[100%] h-[90%]" />
        )}
      </Modal>
    </main>
  );
};
export default SyndicateFlow;
