import QuestionForm from "@/components/form-builder/question-manager/question-form";

export default function EditQuestionPage({
  params,
}: {
  params: {
    questionId: string;
  };
}) {
  const questionId = params.questionId;
  return (
    <div className="py-8">
      <QuestionForm questionId={questionId} />
    </div>
  );
}
