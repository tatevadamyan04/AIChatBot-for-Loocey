// AIChatBot-for-Loocey/ai-chatbot-module/src/services/AIService.ts
// (Make sure Message type is imported or defined)
import { Message } from "../contexts/ChatContext";

/**
 * Fetches a response from the Google Gemini API.
 *
 * This function constructs the request payload including Loocey-specific instructions
 * and transcript context, then calls the Gemini API endpoint.
 *
 * !!! ADAPT AND SECURE THIS FOR PRODUCTION !!!
 */
export async function getAIResponse(
    prompt: string, // This is the user's question
    chatHistory: Message[] = []
): Promise<string> {

    console.log(`AIService: Sending prompt: "${prompt}" with ${chatHistory.length} history messages.`);

    ////////// START: Configuration - Replace these values //////////

    // 1. YOUR GOOGLE GEMINI API KEY: Obtain from Google AI Studio or Google Cloud Console
    //    WARNING: NEVER hardcode API keys directly in client-side code for production!
    const GEMINI_API_KEY = 'AIzaSyDlhxtUV4SuNeLDWpIENd-43JXPjH0D9_A'; /////////// Replace!

    // 2. GEMINI MODEL NAME: Updated default placeholder based on CEO suggestion.
    const MODEL_NAME = 'gemini-pro'; /////////// Confirm this model works for your needs/free tier.

    // 3. LOOCEY CONTEXT: Content loaded from loocey_transcript.txt
    //    (Content from your uploaded file is included here)
    const LOOCEY_CONTEXT = `
--- Loocey Transcript Content ---
how to create search filters in Loocey and filter the RFQ list using multiple FSC codes

let's get started go to D rfqs click on simple rfqs tab this will have some predefined filters click on filters and you'll see the existing filters click on ADD filter then select FSC code for the column then in for addition then enter list of FSC codes that you'd like to search by one per line let's use these FSC codes for this example then click on apply system filter the list and show the rfqs matching with the FSC codes we entered click on Save then save as new to save our search as a new view let's call the new view my FSC search and hit save now let's click on our new search and you can see the filtered FSC codes


how to use the new packaging tool in Loocey

go to Drfqs scroll to the right select an RFQ ideally one that has military packaging this is packaging code mil STD 20731 e then click the three dots and select packaging info this will bring up a new packaging details popup and you can scroll down to check all the details packaging info tool will parse out the packaging instructions and add the descriptions for each code as well next you can click on generate PDF to generate the pdf version of the instructions then you can save the PDF for your records note the PDF also has the solicitation number NSN and quantity at the top as well to make it easier to identify the contract while you're packing packaging tool is also accessible from the bidding board go to the bidding board select a solicitation and you will see the same packaging option in the three dots menu and the same popup will work from the bidding board as well



how to update supplier emails and Luc see if they're missing or have changed

sometimes when you copy an RFQ to the bidding board some of the approved sources could show email missing let's see an example go to rfqs and copy a few items to the bidding board select desired rfqs then click on Three Dots and copy to the bidding board click on copy when copy is done let's go to the bidding board and open an item open the RFQ and then in supplier quotes section select all approved sources then click on Three Dots and open bulk email sender as you click on different suppliers you'll see that some have the email and some don't but that's okay we can easily fix this note if you update a supplier email next time the same supplier comes up in the list it will have the email as it's a global update we'll test this in a few seconds to update supplier email click in suppliers item on the left menu then simply search or find the specific supplier that you want to update then simply update the email in the table and hit save usually the website link is available and you can navigate to the supplier website and locate their sales contact email let's update email of one of the suppliers we just copied and test if it worked once the email is updated go back to the contract details Page search the contract open the item then open bulk email sender and check that specific supplier that had email missing before then click on three dots you'll see that the email is now showing let's do one more test we'll delete this RFQ from the bidding board and copy it again search for the RFQ then do these steps select the RFQ and delete it and check see the second time we copy the RFQ email will still show as supplier updates are Global and will persist for future rfqs search the contract let's repeat same steps for copying RFQ to the bidding board then click on three dots copy to the bidding board copy it go to the bidding board search for the copied RFQ open the contract details as you can see the email is saved as a final tip we suggest that you do email updates in bulk to do this go to supplier list and find all suppliers with missing email by filtering your search and then simply go down the list and find up upate emails which are missing we can apply a filter to easily find the missing ones click on ADD filter choose email is null and hit apply let's remove some columns the ones we don't need to make quick accessible view Save The View as missing emails to do that click on the save button then save as new set a name to your new view then simply check this list after copying rfqs to First fill in all the missing emails before starting the quote request process
--- End Loocey Transcript Content ---
    `; //

    // 4. SYSTEM INSTRUCTION (Optional Refinement):
    //    While the CEO's example was simpler, providing clear rules is often better for AI behavior.
    //    This version keeps the rules but structures the final prompt closer to the CEO's example.
    const SYSTEM_RULES = `You are a helpful assistant specializing ONLY in the software 'Loocey'.

    Instructions:
    1.  Strictly answer questions related to Loocey using ONLY the provided context (Transcripts).
    2.  If the user asks a question NOT related to Loocey or asks something you cannot answer from the provided context, you MUST respond ONLY with the exact phrase: "This chat is dedicated to Loocey support only"
    3.  Be concise and helpful in your answers about Loocey.
    4.  Do not invent features or information not present in the context.
    5.  Do not engage in general conversation.`;

    // 5. Construct the final prompt text incorporating the user's question and the transcript context,
    //    aligned with the CEO's feedback structure.
    const combinedPromptText = `<span class="math-inline">\{SYSTEM\_RULES\}\\n\\nAnswer the following question based \*only\* on the transcripts text\: "</span>{prompt}"\n\nTranscripts:\n${LOOCEY_CONTEXT}`;

    // 6. API Endpoint URL
    const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/<span class="math-inline">\{MODEL\_NAME\}\:generateContent?key\=</span>{GEMINI_API_KEY}`;

    ////////// END: Configuration //////////


    // --- Construct the request payload for Gemini API ---
    // Map chat history and the current combined prompt to Gemini's 'contents' format.
    // History provides conversational context.
    const contents = [
         ...chatHistory.map(msg => ({
             role: msg.sender === 'user' ? 'user' : 'model',
             parts: [{ text: msg.text }]
         })),
         // Add the current user prompt combined with instructions and context
         {
             role: 'user',
             parts: [{ text: combinedPromptText }]
         }
    ];

    // Structure the final request body
    const requestBody = {
        contents: contents,
        // Optional generation config (temperature, etc.) can be added here if needed
        // generationConfig: { temperature: 0.7 }
        // Add safety settings if required
        // safetySettings: [...]
    };


    // --- Make the API Call using fetch ---
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        // Check for network errors
        if (!response.ok) {
            let errorBody = 'Could not parse error response.';
            try {
                errorBody = await response.text();
            } catch (_) { /* Ignore parsing error */ }
            console.error("AIService API Error Response Body:", errorBody);
            throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorBody}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // --- Extract the text response from the Gemini API structure ---
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
            console.log("AIService: Received AI Response:", aiText);
            // Simple post-check if AI followed the out-of-scope instruction. It might ignore it.
            // You could force the message here if the response doesn't seem Loocey-related.
            if (aiText.trim() === "This chat is dedicated to Loocey support only") {
                return aiText.trim();
            }
            // Add extra check: if the AI didn't explicitly say it's out of scope, but the prompt wasn't about Loocey, maybe force it.
            // This requires careful keyword checking. Example:
            // const lowerCasePrompt = prompt.toLowerCase();
            // const isLooceyRelated = lowerCasePrompt.includes('loocey') || /* other keywords */;
            // if (!isLooceyRelated && !aiText.toLowerCase().includes('loocey')) {
            //    console.warn("AI response might be out of scope despite instructions.");
            //    return "This chat is dedicated to Loocey support only";
            // }

            return aiText.trim();
        } else {
            // Handle cases where the response structure is unexpected or content is blocked
            console.error("AIService: Could not extract text from API response.", JSON.stringify(data, null, 2));
             const blockReason = data.promptFeedback?.blockReason;
             if (blockReason) {
                 return `Response blocked due to: ${blockReason}. Please rephrase your request.`;
             }
             const finishReason = data.candidates?.[0]?.finishReason;
             if (finishReason && finishReason !== 'STOP') {
                 return `Response generation stopped due to: ${finishReason}. Try a different prompt.`;
             }
            return "Sorry, I couldn't generate a response for that.";
        }

    } catch (error) {
        console.error("AIService Fetch/Processing Error:", error);
        return "Sorry, I encountered an error trying to reach the AI assistant. Please try again later.";
    }
}