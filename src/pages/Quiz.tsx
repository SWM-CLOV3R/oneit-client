import { useAtomValue, useSetAtom } from 'jotai'
import { loading, name, question, recipient } from '@/lib/atoms'
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { finishChat, next } from '@/api/chat';
import { Question } from "@/lib/types";

// MAX DEPTH of the chat
const MAXDEPTH = 8;

const Quiz = () => {
    const isloading = useAtomValue(loading)
    const getNextQuestion = useSetAtom(next)
    const endChat = useSetAtom(finishChat)
    const questionList = useAtomValue(question)
    const userRecipient = useAtomValue(recipient)
    const userName = useAtomValue(name)
    
    const navigate = useNavigate();
    const params = useParams()
    const chatID = params.chatID
    const currentDepth = Number(params.currentDepth)

    const [error, setError] = useState(false)
    const [selected, setSelected] = useState(0)

    // Debugging logs
    // console.log('Questions:', questionList[currentDepth], 'Loading:', isloading);

    
    
    const handleAnswerClick = async (index:number) => {
        setSelected(index)
        console.log('Depth:', currentDepth, 'Selected:', index);
        
        if (currentDepth < MAXDEPTH) {
            try {
                await getNextQuestion({question: questionList[currentDepth].question, answer: questionList[currentDepth].options[index]}, currentDepth)
                navigate(`/quiz/${chatID}/${currentDepth+1}`);
            } catch (error) {
                setError(true)
            }
        }else if (currentDepth === MAXDEPTH ) {
            try {
                await endChat(chatID, {question: questionList[currentDepth].question, answer: questionList[currentDepth].options[index]})
                navigate(`/result/${chatID}`);
            } catch (error) {
                setError(true)
            }
        }else{
            setError(true)
        }
    }

    if (isloading) {
        return <Spinner/>
    }

    return (
        <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {questionList[currentDepth].question.replace(/000/g, userName===""?userRecipient:userName).split('\n').map((line, index,array) => (
                    <span key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                    </span>
                ))}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {questionList[currentDepth].options.map((option, index) => (
                <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className=" py-2 px-4 rounded whitespace-pre-wrap flex flex-col items-center justify-center"
                >
                    {option.split('\n').map((line, index,array) => (
                        <span key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                        </span>
                    ))}
                </Button>
                ))}
            </div>
        </div>
        {error && (
            <Dialog open={error} onOpenChange={setError}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e: { preventDefault: () => void; }) => {e.preventDefault();}}>
                <DialogHeader>
                    <DialogTitle>문제 발생</DialogTitle>
                </DialogHeader>
                <DialogDescription>문제가 발생했습니다. 다시 시도해주세요.</DialogDescription>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {setError(false);  navigate('/'); } }>
                    메인으로
                    </Button>
                    <Button type="submit" onClick={() => {setError(false); handleAnswerClick(selected);} }>
                    다시시도
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
            )}
        </>
    )
}

export default Quiz