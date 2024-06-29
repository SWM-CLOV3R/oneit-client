// import { update, ref ,child, get as read} from "firebase/database";
// import { db } from "./firebase";

// export const startChat = atom(null, async (get,set,prompt:string) => {
//     set(loading, true)

//     try {
//         const userAssistant = await getGPTAssistant();
//         set(assistant, userAssistant)

//         const userThread = await getGPTThread();
//         set(thread, userThread)

//         const message = await openai.beta.threads.messages.create(
//             userThread.id,
//             {
//                 role: "user",
//                 content: prompt
//             }
//         );
//         const newQuestion = await runGPT(userThread, userAssistant)

//         if (newQuestion) {
//             set(question, newQuestion);
//         }
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to start chat");
//     } finally{
//         set(loading, false)
//     }
// })
// startChat.debugLabel = "startChat";

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