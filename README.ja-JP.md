# ソーシャルメディアページ（バックエンド + フロントエンド）

![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg) ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen.svg) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.x-blue.svg) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-lightgrey.svg)

<br>
<img src="preview.gif" alt="Preview" >
<br>
<br>

> 私の日本語は少し下手なので、もし何か間違いがあったらご遠慮なく直してください。

## インストール方法
```
git clone https://github.com/toi-la-qanh/social-media-pages-js.git
cd social-media-pages-js
```
### バックエンド
```
cd backend
npm install
npm run dev
```
**データベースの設定**:

- 自分のPostgreSQLデータベースを作成します。
- 次に、[env](./backend/.env.local)に移動し、以下を変更します：

```
DATABASE_URL="postgresql://postgres:database-password@localhost:5432/database-name"
```

- データベースをマイグレーションするには、次を実行します:

```
npm run migrate
```

**テスト用のフェイクデータを作成**:
- [index.ts](./backend/src/index.ts)に移動し、以下を `true` に変更します：
> 作成後は、必ず `false` に戻してください。
```
IndexFactory.run(true);
```

**ユニットテストを実行**:

```
npm run test
```

### フロントエンド
```
cd frontend
npm install
npm run dev
``` 