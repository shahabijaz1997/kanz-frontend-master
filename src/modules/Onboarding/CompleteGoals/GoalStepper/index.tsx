import Button from "../../../../shared/components/Button";
import Stepper from "../../../../shared/components/Stepper";

const GoalStepper = ({ language, navigate, currentStepper }: any) => {
  return (
    <aside className="cursor-pointer rounded-xl p-6 mb-5 shadow-cs-1 w-full = inline-flex justify-center">
      <section className="w-full inline-flex items-center flex-col max-w-[370px]">
        <h3 className="text-neutral-900 text-2xl font-bold">
          {language.individual.philosophyGoals}
        </h3>
        <p className="text-neutral-700 text-base font-normal my-5 text-center">
          {language.individual.philosophysub}
        </p>

        <Stepper currentStep={currentStepper} />
        <Button className="mt-6 h-[38px] w-[140px]" htmlType="submit" onClick={navigate} >
          <small> {currentStepper === 0 ? language.buttons.start : language.buttons.continue}</small>
        </Button>
      </section>
    </aside>
  );
};
export default GoalStepper;
