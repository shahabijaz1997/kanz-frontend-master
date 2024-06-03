import React, { useState, useLayoutEffect, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileType } from "../../../enums/types.enum";
import Modal from "../../../shared/components/Modal";
import { toastUtil } from "../../../utils/toast.utils";
import Header from "../../../shared/components/Header";
import Button from "../../../shared/components/Button";
import Drawer from "../../../shared/components/Drawer";
import CrossIcon from "../../../ts-icons/crossIcon.svg";
import UploadComp from "../../../shared/components/Upload";
import { RootState } from "../../../redux-toolkit/store/store";
import { getRoleBasedAttachments, removeAttachment, submitData } from "../../../apis/attachment.api";
import { saveToken } from "../../../redux-toolkit/slicer/auth.slicer";
import Loader from "../../../shared/views/Loader";
import { KanzRoles } from "../../../enums/roles.enum";
import EditIcon from "../../../ts-icons/editIcon.svg";
import { getUser } from "../../../apis/auth.api";
import { saveUserData } from "../../../redux-toolkit/slicer/user.slicer";

const AddAttachments = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language: any = useSelector((state: RootState) => state.language.value);
  const user: any = useSelector((state: RootState) => state.user.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const event: any = useSelector((state: RootState) => state.event.value);
  const [modalOpen, setModalOpen]: any = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType]: any = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [files, setFiles]: any = useState([]);
  const [attachmentData, setAttachmentData]: any = useState([]);

  useLayoutEffect(() => {
    onGetRoleBasedAttachmentDetails();
  }, []);

  const setFile = (file: File, id: string, url: string, attachment_id: string, size: string, dimensions: string, type: string) => {
    let _file: any = { name: file?.name, size, dimensions }
    let _attachments: any = [...files, { file: _file, id, url, attachment_id, type: type }];
    setFiles(_attachments);
  };

  const onGetRoleBasedAttachmentDetails = async () => {
    try {
      setLoading(true);
      let { status, data } = await getRoleBasedAttachments(authToken);
      if (status === 200) {
        let uploadPayload = data?.status?.data.map((item: any, idx: number) => {
          item.fid = item.id;
          return item;
        })
        setAttachmentData(uploadPayload);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: 'investor-type' });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFile = async (file: any) => {
    try {
      setLoading(true);
      let { status } = await removeAttachment(file.attachment_id, authToken);
      if (status === 200) {
        file.attachment_url = ""
        let attachs = attachmentData.slice().map((at: any) => {
          if (at.id === file.id) at = file;
          return at;
        });
        setAttachmentData(attachs);
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: "add-attachments" });
      }
      const message =
        error?.response?.data?.status?.message ||
        error?.response?.data ||
        language.promptMessages.errorGeneral;
      toast.error(message, toastUtil);
    } finally {
      setLoading(false);
    }
  };

  const submitAttachmentData = async () => {
    try {
      setLoading(true);
      const { status, data } = await submitData(authToken);
      if (status === 200) {
        setOpen(false);
        setModalOpen(true);
      }
    } catch (error: any) {
      const message = error?.response?.data?.status?.message || language.promptMessages.invalidCode || language.promptMessages.errorGeneral;
      toast.dismiss();
      toast.error(message, toastUtil);
    } finally {
      setLoading(false);
    }
  };


  const checkDisabled = () => {
    let nec_ats: any[] = attachmentData.filter((at: any) => {
      if (at.attachment_url && !files.some((f: any) => f.id === at.id)) return at;
    })
    console.log("checkDisabled", files.length , nec_ats.length);
    if (files.length + nec_ats.length >= 3 && agreeToTerms ? false : true) return true;
    return false;
  };

  const checkSubmit = () => {
    let nec_ats: any[] = attachmentData.filter((at: any) => {
      if (at.attachment_url && !files.some((f: any) => f.id === at.id)) return at;
    })

    console.log("checkSubmit", files.length , nec_ats.length);
    
    if (files.length + nec_ats.length < 3) return true;
    return false;
  };

  return (
    <main className="h-full max-h-full cbc-auth overflow-y-auto overflow-x-hidden">
      {
        loading ? (<Loader />) : (
          <React.Fragment>
            <section>
              <Header custom={true} data={{ leftMenu: language.header.attachment, button: (<button onClick={() => navigate(-1)}> <CrossIcon stroke="#171717" className="w-6 h-6" /></button>) }} />
            </section>

            <aside className="w-[420px] h-full screen500:max-w-[300px] mx-auto py-12">
              <section className="flex items-start justify-center flex-col select-none">
                <h3 className="text-cc-black font-bold text-2xl">
                  {language.buttons.addAttachment}
                </h3>
                <p className="text-neutral-700 font-medium text-base">
                  <span>{language.philosophyGoals.uploadNecessary}.</span>&nbsp;
                  <span
                    className="text-cc-blue cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    {language.v2?.realtor?.attachment_provider}
                  </span>
                </p>
              </section>
              <section className="flex items-start justify-center flex-col mt-8">
                <form className="pt-8 mb-4 w-full">
                  {React.Children.toArray(
                    attachmentData.map((item: any) => {
                      return (
                        item?.attachment_url ? (
                          <div className="mb-4 w-full select-none">
                            <div className="block text-neutral-700 text-base font-medium">
                              <div>{item[event]?.name}</div>
                              <small className="text-neutral-700 font-normal">{item[event]?.label}</small>
                              <div className="main-embed w-[300px] h-[200px] overflow-hidden relative mb-2">
                                <EditIcon stroke="#fff" className="w-7 h-7 absolute right-2 top-2 cursor-pointer rounded-md p-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.078)" }} onClick={() => removeFile(item)} />
                                {item?.attachment_kind === FileType.IMAGE ? <img src={item?.attachment_url} className="block w-[110%] h-[110%] overflow-hidden" /> : <embed src={item?.attachment_url} className="block w-[110%] h-[110%] overflow-hidden" />}
                              </div>
                            </div>
                          </div>
                        ) :
                          (<UploadComp id={item.fid} fid={item.id} files={files} file={files?.length && files.find((f: any) => f.id === item.id)} setFile={setFile} title={item[event]?.name} subTitle={item[event]?.label}
                            language={language} setFiles={setFiles} setFileType={setFileType} setModalOpen={setModalOpen} onRemoveFile={(fid: string) => {
                              let attachs = attachmentData.slice().map((at: any) => {
                                if (at.id === fid) at.attachment_url = "";
                                return at;
                              });
                              setAttachmentData(attachs);
                            }} />
                          ));
                    })
                  )}
                </form>
              </section>
              <section className="w-full inline-flex items-center gap-2 rounded-md border border-grey w-[420px] p-4 check-background">
                <input type="checkbox" className="accent-cyan-800 h-3 w-3 cursor-pointer" checked={agreeToTerms} onChange={() => setAgreeToTerms(!agreeToTerms)} />
                <p className="text-neutral-500 text-sm font-normal">
                  {language?.common?.agree}
                  <a href="/terms-and-conditions" className="text-cc-blue font-medium cursor-pointer" target="_blank" >
                    {language?.common?.termsConditions}
                  </a>
                  {language?.v2?.common?.understood}
                  <a href="/privacy-policy" className="text-cc-blue font-medium cursor-pointer" target="_blank" >
                    {language?.v2?.common?.privacyPolicy}
                  </a>
                </p>
              </section>
              <section className="w-full inline-flex items-center justify-between py-10">
                <Button className="h-[38px] w-[140px]" htmlType="submit" type="outlined" onClick={() => navigate(-1)} >
                  {language?.buttons?.back}
                </Button>

                <Button disabled={checkDisabled()} className="h-[38px] w-[140px]" htmlType="submit"
                  onClick={() => {
                    let errors: string[] = [];
                    if (checkSubmit())
                      errors.push(language.promptMessages.pleaseUploadAttachments);
                    if (!agreeToTerms)
                      errors.push(language.promptMessages.pleaseAcceptPP);
                    if (errors.length === 0) {
                      submitAttachmentData();
                      return;
                    }
                    toast.dismiss();
                    errors.forEach((e) => toast.warning(e, toastUtil));
                    errors = [];
                  }}
                >
                  {language?.v2?.buttons?.send}
                </Button>
              </section>
            </aside>
          </React.Fragment>
        )
      }
      <Drawer isOpen={isOpen} setIsOpen={(val: boolean) => setOpen(val)}>
        <header className="font-bold text-xl">
          {language.v2.realtor.attachment_provider}
        </header>
        {user?.type === KanzRoles.INVESTOR && <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.attachments}</p>}
        {user?.type === KanzRoles.REALTOR && <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.attach_realtor}</p>}
        {user?.type === KanzRoles.STARTUP && <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.attach_startup}</p>}
        {user?.type === KanzRoles.SYNDICATE && <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.attach_syndicate}</p>}
      </Drawer>
      <Modal show={modalOpen ? true : false}>
        {typeof modalOpen === "string" ? (
          <React.Fragment>
            <div className="rounded-md h-8 w-8 inline-grid place-items-center cursor-pointer absolute right-2 top-2" style={{ backgroundColor: "rgba(0, 0, 0, 0.078" }}>
              <CrossIcon stroke="#fff" className="w-6 h-6" onClick={() => setModalOpen(null)} />
            </div>
            {fileType === FileType.IMAGE ? (
              <img src={modalOpen} alt="Img" className="max-h-[100%]" />
            ) : (
              <embed src={modalOpen} type="application/pdf" className="w-[100%] h-[90%]" />
            )}
          </React.Fragment>
        ) : (
          <div className="p-12 rounded-md shadow-cs-1 flex flex-col items-center w-full bg-white outline-none focus:outline-none screen800:px-3">
            <h3 className="text-xl font-bold text-center">
              {language.modal.thankyou} {language.modal.sub_1}
            </h3>

            <div className="w-[80%] screen800:w-full">
              <p className="mt-4 text-sm font-normal text-neutral-500 text-center leading-relaxed">
                {language.modal.sub_2} <button className="text-blue-700" onClick={() => navigate("/welcome")}>{language.modal.sub_3}</button> {language.modal.sub_4}
              </p>
            </div>
            <Button
              className="mt-8 w-[120px] h-9"
              htmlType="button"
              onClick={() => {
                setModalOpen(false);
                localStorage.removeItem("investor-type");
                localStorage.removeItem("accert");
                navigate("/welcome");
              }}
            >
              {language.buttons.continue}
            </Button>
          </div>
        )}
      </Modal>
    </main>
  );
};
export default AddAttachments;
