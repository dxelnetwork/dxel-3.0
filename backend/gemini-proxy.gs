/**
 * DXEL Network - Gemini API Secure Proxy
 * 
 * Instructions:
 * 1. Go to script.google.com and create a new project.
 * 2. Paste this code into the editor.
 * 3. Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API Key from Google AI Studio.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select "Web app" as the type.
 * 6. Set "Execute as" to "Me".
 * 7. Set "Who has access" to "Anyone".
 * 8. Click "Deploy" and copy the "Web app URL".
 * 9. Paste that URL into dxel-ai.js as the LLM_ENDPOINT.
 */

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const MODEL = 'gemini-1.5-flash';

function doPost(e) {
  // Setup CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const payload = JSON.parse(e.postData.contents);
    const messages = payload.messages; // Expecting array of {role, parts: [{text}]}
    const systemInstruction = payload.systemInstruction; // Expecting string

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    // Format payload for Gemini API
    const geminiPayload = {
      contents: messages
    };

    if (systemInstruction) {
      geminiPayload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(geminiPayload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());

    let aiText = "";
    if (result.candidates && result.candidates.length > 0) {
      aiText = result.candidates[0].content.parts[0].text;
    } else {
      aiText = "I'm experiencing a temporary network issue. Could you please try again?";
      console.error("Gemini Error:", result);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      response: aiText 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle OPTIONS request for CORS preflight
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
