import express from 'express';
import bodyParser from 'body-parser';

import slack from './ports/slack';
import sandbox from './domain/sandbox';

const server = express();

const answerChallenge = (req, res, next) => {
  if (req.body.challenge) {
    return res.send(req.body.challenge);
  }

  next();
};

const handler = (req, res) => {
  const { event: { text, type, channel, username } } = req.body;
  res.sendStatus(200);

  if (username === 'ShellBot' || type !== 'message') {
    return false;
  }

  const { result, status } = sandbox.run(text);

  slack.postMessage(channel, result, status);
};


server.post(
  '/integration/slack',
  bodyParser.json(),
  answerChallenge,
  handler
);

server.listen(process.env.PORT || 3000, () => {
  console.log('Server up!');
});