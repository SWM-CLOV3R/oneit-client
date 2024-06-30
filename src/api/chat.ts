import { update, ref ,set as write} from "firebase/database";
import { db } from "@/config/firebase";
import { atom } from "jotai";
import { gender, loading, occasion, priceRange, recipient, answers, gift } from "@/config/atoms";
import product from "@/data/product.json";
import question from "@/data/question.json";
import { Answer, Product } from "@/config/types";

type AnswerOptions = {
    [key: string]: number[];
};

type Questions = {
    [question: string]: AnswerOptions;
};
const questionData: Questions = question;


export const startChat = atom(null,async(get,set,chatID)=>{
    set(loading, true)
    try{
        
        await write(ref(db, `chats/${chatID}`), {
            chatID,
            gender: get(gender),
            recipient: get(recipient),
            occasion: get(occasion),
            priceRange: get(priceRange)
        });
    }catch(error){
        console.log(error);
        throw new Error("Failed to start chat");
    }
    finally{
        set(loading, false)
    }
})
startChat.debugLabel = "startChat";

const recommend = (gender: string, answers: Answer[]): Product[] => {
    let pool: { [key: string]: Product } = { ...product };
    answers.forEach(answer => {
        const matchingProductsKeys: number[] = questionData[answer.question]?.[answer.answer];
        if (matchingProductsKeys && matchingProductsKeys.length > 0) {
            const filteredPool: { [key: string]: Product } = {};
            matchingProductsKeys.forEach((key: number) => {
                if (pool[key.toString()]) {
                    filteredPool[key.toString()] = pool[key.toString()];
                }
            });
            // If filtering results in an empty pool but the original pool was not empty, do not apply the filter.
            if (Object.keys(filteredPool).length > 0 || Object.keys(pool).length === 0) {
                pool = filteredPool;
            }
        }
    });

    // If the product pool has product with different gender, filter out the products
    if (gender == "남성"){
        questionData["성별"]?.["여성"].forEach((key: number) => {
            delete pool[key.toString()];
        })
    } else {
        questionData["성별"]?.["남성"].forEach((key: number) => {
            delete pool[key.toString()];
        })
    }


    return Object.values(pool);
};


export const finishChat = atom(null, async (get,set,chatID) => {
    set(loading, true)
    const answerList = get(answers)
    try {
        await update(
            ref(db, `/chats/${chatID}`),
            { answers: answerList}
        );

        //get recommendation proudcts
        const recommendList = recommend(get(gender),answerList)

        //select random product
        const recommended = recommendList[Math.floor(Math.random() * recommendList.length)]

        set(gift, recommended)

        await update(
            ref(db, `/chats/${chatID}`),
            { result: recommended }
        );


    } catch (error) {
        console.log(error);
        throw new Error("Failed to finish chat");
    } finally{
        set(loading, false)
    }
});

// export const updateQuestion = atom(null, async (get,set,answer:Answer) => {
    
//     // API call to get next question
//     try {
//         set(loading, true)
//         const message = await openai.beta.threads.messages.create(
//             get(thread).id,
//             {
//                 role: "user",
//                 content: answer.answer
//             }
//         );
//         // console.log(message);
        
//         const newQuestion = await runGPT(get(thread), get(assistant))
//         set(question, newQuestion)
//         set(answers, [...get(answers), answer])
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to update question");
//     } finally{
//         set(loading, false)
//     }
// })
// updateQuestion.debugLabel = "updateQuestion";

// export const finishChat = atom(null, async (get,set,answer:Answer, chatID) => {
//     set(answers, [...get(answers), answer])
//     try {
//         set(loading, true)
//         update(
//             ref(db, `/chats/${chatID}`),
//             { answers: get(answers) }
//         );

//         const recommended = await getRecommendation(get(thread), get(assistant))

//         set(gift, recommended)
//         update(
//             ref(db, `/chats/${chatID}`),
//             { result: recommended }
//         );

//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to finish chat");
//     } finally{
//         set(loading, false)
//         set(depth, 0)
//         set(answers, [])
//         set(question, MockQuestions)
//     }
// })
// finishChat.debugLabel = "finishChat";