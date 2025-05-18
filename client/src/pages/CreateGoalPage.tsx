import { BackLink, GoalForm } from "@/components";

const CreateGoalPage = () => {
  return (
    <div className="container mx-auto">
      <BackLink to="/goals" />
      <GoalForm type="create" />
    </div>
  );
};

export default CreateGoalPage;
