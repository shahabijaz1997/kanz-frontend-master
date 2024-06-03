import React, { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux-toolkit/store/store";
import Stepper from "../../../../shared/components/Stepper";
import Spinner from "../../../../shared/components/Spinner";
import { getInvestmentPhilisophyQuestions, postInvestmentPhilisophyData } from "../../../../apis/philosophy.api";
import { toast } from "react-toastify";
import { toastUtil } from "../../../../utils/toast.utils";
import { saveToken } from "../../../../redux-toolkit/slicer/auth.slicer";
import Drawer from "../../../../shared/components/Drawer";
import HorionGraph from "../../../../assets/investment_horizon_graph.png";
import Button from "../../../../shared/components/Button";
import { KanzRoles } from "../../../../enums/roles.enum";
import { ApplicationStatus } from "../../../../enums/types.enum";
import { checkExist, checkExisting } from "../../../../utils/questioare.utils";
import { RoutesEnums } from "../../../../enums/routes.enum";

const Questionare = ({ step, returnSuccessRedirection }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: any = useSelector((state: RootState) => state.user.value);
  const language: any = useSelector((state: RootState) => state.language.value);
  const authToken: any = useSelector((state: RootState) => state.auth.value);
  const event: any = useSelector((state: RootState) => state.event.value);

  const [mcqs, setMcqs]: any = useState([]);
  const [isOpen, setOpen]: any = useState("");
  const [textAnswer, setTextAnswer]: any = useState("");
  const [questions, setQuestions]: any = useState([]);
  const [validations, setValidations]: any = useState([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected]: any = useState({});
  const [loading, setLoading]: any = useState(true);
  const [existing, setExisting]: any = useState(true);

  useLayoutEffect(() => {
    if (user.type !== KanzRoles.INVESTOR) navigate(RoutesEnums.WELCOME);
  }, []);

  useLayoutEffect(() => {
    getQuestionares(step);
  }, [step]);

  useLayoutEffect(() => {
    if (Object.keys(selected).length > 0 && existing) {
      let philisophyData: any = localStorage.getItem("philosophy");
      let parsed = JSON.parse(philisophyData) || {};

      let se_ques = selected[step]?.questions.map((as: any) => as.question_id);
      se_ques && setValidations(se_ques);
      if (questions?.questions[0]?.question_type === "checkbox") {
        parsed[step]?.questions ? setMcqs(parsed[step].questions[0]?.answer_meta?.options) : setMcqs(questions?.questions[0][event]?.options?.filter((it: any) => it.selected));
      }
      else if (questions?.questions[0]?.question_type === "text") {
        setTextAnswer(questions?.questions[0][event]?.answer);
      }
    }
  }, [selected, existing]);

  const getQuestionares = async (pg: number) => {
    try {
      setLoading(true);
      const { status, data }: any = await getInvestmentPhilisophyQuestions(pg, authToken);
      if (status === 200) {
        let philisophyData: any = localStorage.getItem("philosophy");
        let parsed = JSON.parse(philisophyData) || {};
        setSelected(parsed);
        let allQuestions = data?.status?.data?.questions;
        let inprogress = checkExisting(allQuestions, event);

        if (inprogress) {
          setExisting(true);
          allQuestions.forEach((q: any) => {
            let selected = q[event]?.options?.find((s: any) => s.selected);
            toggleAnswerSelection(q, selected);
          });
        } else {
          if (JSON.parse(philisophyData)) {
            if (parsed[step]) {
              let d = parsed[step]?.questions.map((as: any) => as.question_id);
              setValidations(d);
            } else setValidations([]);
          }
          if (allQuestions && allQuestions[0]?.question_type === "checkbox")
            if (parsed[step]?.questions[0]) setMcqs(parsed[step].questions[0]?.answer_meta?.options);
          if (allQuestions[0]?.question_type === "text") setTextAnswer(selected[step]?.questions[0]?.answers[0])
        }
        setQuestions(data?.status?.data);
        setPage(pg);
      }
    } catch (error: any) {
      const message = error?.response?.data?.status?.message || error?.response?.data || language.promptMessages.errorGeneral;
      toast.error(message, toastUtil);
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: `philosophy-goals/${step}` });
      }
    } finally {
      let timer = setTimeout(() => {
        setLoading(false);
        clearTimeout(timer);
      }, 500);
    }
  };

  const submitData = async (payload: any) => {
    try {
      setOpen(false);
      setLoading(true);
      let { status, data } = await postInvestmentPhilisophyData(payload, authToken);
      if (status === 200) localStorage.setItem("step", step);
      if (step === questions?.total_steps && status === 200)
        returnSuccessRedirection(data);
    } catch (error: any) {
      const message = error?.response?.data?.status?.message || error?.response?.data || language.promptMessages.errorGeneral;
      toast.error(message, toastUtil);
      if (error.response && error.response.status === 401) {
        dispatch(saveToken(""));
        navigate("/login", { state: `philosophy-goals/${step}` });
      }
    } finally {
      let timer = setTimeout(() => {
        setLoading(false);
        clearTimeout(timer);
      }, 500);
    }
  };

  const checkBoxCheckExist = (as: any) => {
    if (!mcqs.length) return false;
    let found: any = mcqs?.some((q: any) => q?.statement === as.statement);
    return found;
  };

  const toggleAnswerSelection = (q: any, a: any) => {
    setSelected((prevSelected: any) => {
      const updatedSelected = { ...prevSelected };
      let found: any = updatedSelected[q.step]?.questions.find(
        (qa: any) => qa.question_id === q.id
      );

      if (found) {
        const filtered = updatedSelected[q.step]?.questions.filter((qa: any) => qa.question_id !== q.id);
        filtered.push({ question_id: q.id, answers: [a?.statement], answer_meta: { options: [a] } });
        updatedSelected[q.step].questions = filtered;
      } else {
        if (updatedSelected[q.step]?.questions?.length) {
          updatedSelected[q.step]?.questions.push({ question_id: q.id, answers: [a?.statement], answer_meta: { options: [a] } });
        } else
          updatedSelected[q.step] = { step, questions: [{ question_id: q.id, answers: [a?.statement], answer_meta: { options: [a] } }] };
      }

      return updatedSelected;
    });
  };

  const renderMultipleChoiceQuestionaire = (ques: any) => {
    if (selected && ques.step === 2 && ques.index === 2 && (!selected[`2`] || selected[`2`]?.questions.find((q: any) => q.answers[0] === questions?.questions[0][event]?.options[1]?.statement)))
      return <React.Fragment></React.Fragment>;
    if (ques?.question_type === "text") {
      return (
        <section className="flex items-start justify-center flex-col mt-10 max-w-[420px] screen500:max-w-[300px]">
          <h3 className="text-neutral-700 font-medium text-base w-[420px]">
            {ques[event]?.title}
          </h3>
          <p className="text-neutral-500 font-normal text-lg">
            <span>{ques[event]?.statement}</span>&nbsp;
            <span className="text-cc-blue font-medium cursor-pointer" onClick={() => setOpen(true)} >
              {language.common.learn}
            </span>
          </p>

          <section className="mb-8 w-full relative mt-3">
            <textarea value={textAnswer || ""} onChange={(e) => setTextAnswer(e.target.value)}
              className="rounded-md shadow-sm appearance-none border border-neutral-300 rounded-md w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline h-[100px] resize-none"
            ></textarea>
          </section>
        </section>
      );
    }
    return (
      <section className="flex items-start justify-center flex-col mt-10 max-w-[420px] screen500:max-w-[300px]">
        <h3 className="text-neutral-700 font-medium text-base w-[420px]">
          {ques[event]?.title}
        </h3>
        <p className="text-neutral-500 font-normal text-lg">
          <span>{ques[event]?.statement}</span>&nbsp;
          <span className="text-cc-blue font-medium cursor-pointer" onClick={() => setOpen(true)} >
            {language.common.learn}
          </span>
        </p>
        <section className="mb-8 w-full relative mt-3">
          <ul>
            {ques[event]?.options && React.Children.toArray(
              ques[event]?.options.map((as: any) => {
                return (
                  <li className={`h-[50px] w-[420px] p-4 grey-neutral-200 text-sm font-medium cursor-pointer border border-grey inline-flex items-center justify-start first:rounded-t-md last:rounded-b-md screen500:w-full ${checkExist(selected[ques.step], as) ? "check-background" : "bg-white"
                    }`}
                    onClick={() => {
                      toggleAnswerSelection(ques, as);
                      let _validations = [...validations];
                      let f = _validations.find((v) => v === ques?.id);
                      if (!f) {
                        _validations.push(ques?.id);
                        setValidations(_validations);
                      }
                    }}
                  >
                    <input onChange={() => { }}
                      className="accent-cyan-800 relative float-left mx-2 h-3 w-3 rounded-full border-2 border-solid border-cyan-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04]"
                      type="radio" checked={checkExist(selected[ques.step], as) ? true : false} />
                    <small>{as?.statement}</small>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </section>
    );
  };

  const renderCheckboxQuestionaire = (ques: any) => {
    if (selected && ques.step === 2 && ques.index === 2 && (!selected[`2`] || selected[`2`]?.questions.find((q: any) => q.answer === questions?.questions[0][event]?.options[1]?.statement)))
      return <React.Fragment></React.Fragment>;
    return (
      <section className="flex items-start justify-center flex-col mt-10 max-w-[420px] screen500:max-w-[300px]">
        <h3 className="text-neutral-700 font-medium text-base w-[420px]">
          {ques[event]?.title}
        </h3>
        <p className="text-neutral-500 font-normal text-lg">
          <span>{ques[event]?.statement}</span>&nbsp;
          <span className="text-cc-blue font-medium cursor-pointer" onClick={() => setOpen(true)}>
            {language.common.learn}
          </span>
        </p>
        <section className="mb-8 w-full relative mt-3">
          <ul>
            {ques[event]?.options &&
              React.Children.toArray(
                ques[event]?.options.map((as: any) => {
                  return (
                    <li
                      className={`h-[50px] w-[420px] p-4 grey-neutral-200 text-sm font-medium cursor-pointer border border-grey inline-flex items-center justify-start first:rounded-t-md last:rounded-b-md screen500:w-full ${checkBoxCheckExist(as) ? "check-background" : "bg-white"
                        }`}
                      onClick={() => {
                        let _mcqs = [...mcqs];
                        if (_mcqs.find((m: any) => m.statement === as.statement)) {
                          let filtered = _mcqs.filter((m: any) => m.statement !== as.statement);
                          setMcqs(filtered);
                        } else
                          setMcqs((prv: any) => {
                            return [...prv, as];
                          });
                        let _validations = [...validations];
                        let f = _validations.find((v) => v === ques?.id);
                        if (!f) {
                          _validations.push(ques?.id);
                          setValidations(_validations);
                        }
                      }}
                    >
                      <input
                        onChange={() => { }}
                        className="accent-cyan-800 relative float-left mx-2 h-3 w-3 rounded-full border-2 border-solid border-cyan-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04]"
                        type="checkbox"
                        checked={checkBoxCheckExist(as) ? true : false}
                      />
                      <small>{as?.statement}</small>
                    </li>
                  );
                })
              )}
          </ul>
        </section>
      </section>
    );
  };

  const renderBooleanQuestionaire = (ques: any) => {
    return (
      <section className="flex items-start justify-center flex-col mt-10 max-w-[420px] screen500:max-w-[300px]">
        <h3 className="text-neutral-700 font-medium text-base w-[420px]">
          {ques[event]?.title}
        </h3>
        <p className="text-neutral-500 font-normal text-lg">
          <span>{ques[event]?.statement}</span>&nbsp;
          <span className="text-cc-blue font-medium cursor-pointer" onClick={() => setOpen(true)} >
            {language.common.learn}
          </span>
        </p>
        <section className="w-full inline-flex items-center justify-between mt-4 gap-5">
          {ques[event]?.options &&
            React.Children.toArray(
              ques[event]?.options.map((as: any) => {
                return (
                  <li
                    className={`rounded-md bg-white h-[50px] w-[420px] p-4 grey-neutral-200 text-sm font-medium cursor-pointer border border-grey inline-flex items-center justify-start screen500:w-full${checkExist(selected[ques.step], as)
                      ? "check-background" : "bg-white"}`}
                    onClick={() => {
                      toggleAnswerSelection(ques, as);
                      let _validations = [...validations];
                      let f = _validations.find((v) => v === ques?.id);
                      if (!f) {
                        _validations.push(ques?.id);
                        setValidations(_validations);
                      }
                    }}
                  >
                    <input
                      onChange={() => { }}
                      className="accent-cyan-800 relative float-left mx-2 h-3 w-3 rounded-full border-2 border-solid border-cyan-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04]"
                      type="radio"
                      checked={
                        checkExist(selected[ques.step], as) ? true : false
                      }
                    />
                    <small>{as?.statement}</small>
                  </li>
                );
              })
            )}
        </section>
      </section>
    );
  };

  const onSetPrev = () => {
    checkValidation();
    setOpen(false);
    let philisophyData: any = localStorage.getItem("philosophy");
    let philData: any = JSON.parse(philisophyData)
    localStorage.setItem("philosophy", JSON.stringify(philData));
    if (page !== 1) navigate(`/philosophy-goals/${page - 1}`);
    else navigate(`/complete-goals`);
  };

  const onSetNext = () => {
    if (!checkValidation()) {
      toast.dismiss();
      return toast.warning(language.promptMessages.pleaseSelectAllData, toastUtil);
    }
    let _selected = { ...selected };
    if (questions?.questions[0]?.question_type === "text") {
      if (_selected[step])
        _selected[step].questions = [{ question_id: questions?.questions[0]?.id, answers: [textAnswer], answer_meta: {} }];
      else _selected[step] = { questions: [{ question_id: questions?.questions[0]?.id, answers: [textAnswer], answer_meta: {} }] };
      setSelected(_selected);
    }
    let payload: any = { investment_philosophy: {} };
    let philisophyData: any = localStorage.getItem("philosophy");

    if (step !== 3) {
      let philData: any = { ...JSON.parse(philisophyData), ..._selected };
      localStorage.setItem("philosophy", JSON.stringify(philData));
      payload.investment_philosophy.step = _selected[step]?.step;
      payload.investment_philosophy.questions = _selected[step]?.questions;
    } else {
      let _mcqs = [...mcqs];
      let answers = _mcqs.map((m) => m.statement);
      let philData: any = { ...JSON.parse(philisophyData), 3: { step: 3, questions: [{ question_id: questions?.questions[0]?.id, answers, answer_meta: { options: mcqs } }] } };
      localStorage.setItem("philosophy", JSON.stringify(philData));
      payload.investment_philosophy.step = 3;
      payload.investment_philosophy.questions = [{ question_id: questions?.questions[0]?.id, answers, answer_meta: { options: mcqs } }];
    }

    submitData(payload);
    if (step !== questions?.total_steps)
      navigate(`/philosophy-goals/${page + 1}`);
  };

  const checkValidation = () => {
    if (questions?.questions && questions?.questions[0]?.question_type === "checkbox") {
      if (mcqs?.length > 0) return true;
      return false;
    } else if (questions?.questions && questions?.questions[0]?.question_type === "text") {
      if (textAnswer?.length > 0) return true;
      return false;
    } else {
      if (user?.status === ApplicationStatus.REOPENED) return true;
      if (!questions?.questions?.length) return false;
      else {
        if (!questions?.questions?.length) return false;
        else if ((step !== 2 && validations?.length === questions?.questions?.length) ||
          ((step === 2 && validations?.length > 0 && selected[`2`]?.questions?.find((q: any) => q.answers[0] === questions?.questions[0][event]?.options[1]?.statement)) ||
            (step === 2 && validations?.length === 2 && selected[`2`]?.questions.find((q: any) => q.answers[0] === questions?.questions[0][event]?.options[0]?.statement))))
          return true;
        return false;
      }
    }
  };

  return (
    <aside className="w-full flex items-center justify-center flex-col pt-12 pb-5">
      <Stepper currentStep={step - 1} totalSteps={questions?.total_steps} />
      {loading ? (
        <div className="absolute left-0 top-0 w-full h-full grid place-items-center" style={{ backgroundColor: "rgba(255, 255, 255, 1)", zIndex: 50 }} >
          <Spinner />
        </div>
      ) : (
        <React.Fragment>
          <section className="flex items-start flex-col mt-10 max-w-[420px] screen500:max-w-[300px]">
            {questions?.questions && (
              <h3 className="text-neutral-700 font-bold text-2xl w-[420px]">
                {questions?.questions[0]?.title}
              </h3>
            )}
          </section>

          {questions?.questions?.length &&
            step !== 3 &&
            React.Children.toArray(questions?.questions.map((ques: any) => ques.step === 2 && ques.index === 1 ? renderBooleanQuestionaire(ques) : renderMultipleChoiceQuestionaire(ques)))}

          {questions?.questions?.length && questions?.questions[0]?.question_type === "checkbox" && React.Children.toArray(questions?.questions.map((ques: any) => renderCheckboxQuestionaire(ques)))}

          <section className="flex items-start justify-center w-full flex-col mt-6 max-w-[420px] screen500:max-w-[300px]">
            <div className="w-full inline-flex items-center justify-between mt-16">
              <Button className="h-[38px] w-[140px]" htmlType="button" type="outlined" onClick={onSetPrev}>
                {language?.buttons?.back}
              </Button>
              <Button className="h-[38px] w-[140px]" disabled={!checkValidation()} htmlType="submit" loading={loading} onClick={onSetNext} >
                {step < 5 ? language?.buttons?.continue : language?.buttons?.proceed}
              </Button>
            </div>
          </section>
        </React.Fragment>
      )}

      <Drawer isOpen={isOpen} setIsOpen={(val: boolean) => setOpen(val)}>
        {questions?.questions && questions?.questions[0]?.question_type === "checkbox" ? (
          <React.Fragment>
            <p className="text-neutral-700 font-normal text-sm text-justify">
              {language.modal.horizon_para_1}
            </p>
            <p className="text-neutral-700 font-normal text-sm text-justify">
              {language.modal.horizon_para_2}
            </p>
            <img src={HorionGraph} alt={language.investmentHorizon.horizon} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <header className="font-bold text-xl">
              {language.philosophyGoals.objective}
            </header>
            <p className="text-neutral-700 font-normal text-sm text-justify">{language?.drawer?.questionare}</p>
          </React.Fragment>
        )}
      </Drawer>
    </aside>
  );
};
export default Questionare;
