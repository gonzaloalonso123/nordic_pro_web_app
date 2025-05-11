import QuestionForm from "@/components/form-builder/question-manager/question-form";

export default async function EditQuestionPage(
  props: {
    params: Promise<{
      questionId: string;
    }>;
  }
) {
  const params = await props.params;
  const questionId = params.questionId;
  return (
    <div className="py-8">
      <QuestionForm questionId={questionId} />
    </div>
  );
}
