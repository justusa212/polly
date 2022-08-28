import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{id: string}> = ({id}) => {
    const {data, isLoading} = trpc.useQuery(["questions.get-by-id", {id}])

    const {mutate, data : voteResponse} = trpc.useMutation(
        "questions.vote-on-question",
        {onSuccess: () => window.location.reload()}
    ); 

    if(!data || !data?.pollQuestion) {
        return <div>Question not found</div> 
    }

    return( 
        <div className="p-8 flex flex-col">
            {data?.isOwner && <div className=" bg-red-700 rounded-md p-3">You made this!</div>}
            <div className="text-2xl font-bold">{data?.pollQuestion?.question}</div>
            <div className="flex flex-col gap-4">
                {(data?.pollQuestion?.options as string[])?.map((option,index) => {
                if(data?.isOwner || data?.vote){
                    return <div>{data?.votes?.[index]?._count ?? 0} - {(option as any).text}</ div>;
                }
                return <button 
                onClick={() => mutate( {questionId: data?.pollQuestion!.id, option: index})}
                key = {index}>
                    {(option as any).text}
                    </ button>;
            })} 
            </div>
        </div>
    )
} 

const QuestionPage = () => {
    const {query} = useRouter();
    const{id} = query;
  
    if(!id || typeof id !== "string") {
        return <div>No ID</div>
    }

    return (
        <QuestionsPageContent id={id} />
        ) 
}

export default QuestionPage;