const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

if (!API_KEY) {
  console.warn('No Gemini API key found. Please set the VITE_GEMINI_API_KEY environment variable.');
}

export const generateResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "API key is not configured. Please set the VITE_GEMINI_API_KEY environment variable.";
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from the API response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('Unexpected API response format:', data);
      return "I received an unexpected response format from the AI service. Please try again.";
    }
    
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};
