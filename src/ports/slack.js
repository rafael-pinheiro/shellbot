import { WebClient } from '@slack/client';
const token = 'xoxb-474520692288-476316951847-676doKoPP7buEsyLEpbPI3rU';
const client = new WebClient(token);

const formatterCharacters = {
  success: '`',
  error: '_'
};

export default {
  postMessage(channel, text, type = "success") {
    const formatterCharacter = formatterCharacters[type];
    let result = text;
    
    if (typeof result === 'object') {
      result = JSON.stringify(result, null, 2);
    }
    
    if (typeof result === 'string') {
      result = result
        .split('\n')
        .map(line => `${formatterCharacter}${line}${formatterCharacter}`)
        .join('\n');  
    } else {
      result = `${formatterCharacter}${result}${formatterCharacter}`;
    }
    
    return client.chat.postMessage({
      channel,
      text: result,
    });
  }
};