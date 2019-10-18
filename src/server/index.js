const express = require('express');
const fetch = require('node-fetch');
const YAML = require('yaml');

const app = express();

app.use(express.static('dist'));

app.get('/api/githubYAML', (req, res, next) => {
  const file = req.query && req.query.file;

  if (!file) {
    return res.sendStatus(400);
  }

  /* Sanitise filename... */
  if (!file.startsWith('https://github.com/')
      || !file.includes('/blob/')
      || !file.endsWith('.yaml')) {
    return res.sendStatus(403);
  }

  /* Replace the github domain with the domain used to access raw content */
  const url = `https://raw.githubusercontent.com/${file.substring(19).replace('/blob/', '/')}`;

  return fetch(url)
    .then(data => data.text())
    .then((text) => {
      const yaml = YAML.parse(text);

      return res.send(yaml);
    }).catch(() => res.sendStatus(500));
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
