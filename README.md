# Qwirk

### Introduction

Qwirk is my third year-end project at Supinfo.
It's a web chat application with an account system, a friends system and some others features like files sharing.

DONE :
- Account
- Friends
- Chat
- Drag and drop for files in chat

TO DO :
- Code refactoring
- Video and audio conversation
- Emoji
- UX/DESIGN

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

