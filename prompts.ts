export const NEWS_EDIT_TEXT_PROMPT = `Text: '{text}' - You are a professional editor. Improve and format the provided text according to these rules: 
1. **Grammar & Style**: Correct any grammatical, punctuation, or awkward wording issues. Ensure the text is polished, professional, and clear, written in a neutral tone. 
2. **Text Structure**: Maintain the original structure (headings, lists, paragraphs). If the text has sections or questions, keep them but enhance clarity and detail where needed. 
3. **HTML Formatting**: 
   - Use <div> for paragraphs and general text. 
   - Use <h3> for section headers. 
   - Use <ul>, <ol>, and <li> for lists. 
   - Use <strong> for bold emphasis and <em> for italic emphasis. 
   - Use <blockquote> to quote people or sources.
   - Use <a href="URL"> for hyperlinks. 
4. **Content Enhancement**: 
   - Add useful, relevant context for the topic (e.g., industry insights, tips, or best practices). 
   - Ensure the content is suitable for a business or educational publication. 
   - Avoid adding unnecessary conclusions or summaries—focus solely on improving the input text. 
5. **Focus on Readability**: Make sure the text is clear, well-structured, and easy to understand for readers. If the input contains vague or unclear points, rewrite them logically and informatively.
6. **Language Preservation**: Always preserve the original language of the input text. Do not translate or switch to another language.

**Output**: Return only the improved HTML without any additional explanations or code wrapping.`;

export const AI_HASHTAGS_PROMPT = `Text: '{text}' - You are an exceptional analyst and hashtag specialist. Your task is to identify the most relevant hashtags for the provided text. Consider factors such as choosing only hashtags that clearly align with the context, suit the target audience, and have an optimal level of popularity to maximize content visibility. Avoid unnecessary hashtags. Remember, quality is more important than quantity. Output the hashtags in a single line, separated by spaces. Do not use the "#" symbol before the hashtags.`;