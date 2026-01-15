# SOCIAL MEDIA PAGES (BACKEND + FRONTEND !== FOLDERS)

![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg) ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen.svg) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.x-blue.svg) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-lightgrey.svg)

[Tiếng Việt](./README.vi-VN.md) | [日本語](./README.jp-JP.md)
<br>
![Preview](preview.gif)
<br>

## Install
```
git clone https://github.com/toi-la-qanh/social-media-pages-js.git
cd social-media-pages-js
```
### Backend
```
cd backend
npm install
npm run dev
```

**Set up database**:
- Create your own postgres database.
- Then go to [env](./backend/.env.local), modify this:

```
DATABASE_URL="postgresql://postgres:database-password@localhost:5432/database-name"
```

- To migrate database, run:

```
npm run migrate
```

**Create fake data for testing**: 
- Go to [index.ts](./backend/src/index.ts), modify this to `true`:

```
IndexFactory.run(true);
```
> After that, change it to `false` or else your computer will blewed up.

**Run Unit Test**:

```
npm run test
```

### Frontend
```
cd frontend
npm install
npm run dev
```