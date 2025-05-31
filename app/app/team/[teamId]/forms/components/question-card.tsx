// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Award, Plus } from "lucide-react";

// export const QuestionCard = () => {
//   return (
//     <div
//       key={question.id}
//       className="p-3 hover:bg-muted/50 flex items-start gap-3"
//     >
//       {question.image_url && (
//         <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
//           <Image
//             src={question.image_url || "/placeholder.svg"}
//             alt={question.question}
//             fill
//             className="object-cover"
//           />
//         </div>
//       )}
//       <div className="flex-1">
//         <div>
//           <p className="font-medium text-sm">{question.question}</p>
//           <div className="flex gap-2 mt-1 flex-wrap">
//             <Badge variant="outline" className="text-xs">
//               {categories.find((cat) => cat.id === question.category_id)?.name}
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               {question.input_type}
//             </Badge>
//             <Badge variant="outline" className="text-xs bg-amber-50">
//               <Award className="h-3 w-3 mr-1 text-amber-500" />
//               {question.experience} XP
//             </Badge>
//           </div>
//         </div>
//       </div>
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={() => handleAddQuestion(question.id)}
//         className="h-6 w-6 shrink-0"
//       >
//         <Plus className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };
