# Mạng xã hội (BACKEND + FRONTEND KHÁC FOLDERS)

![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg) ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen.svg) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.x-blue.svg) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-lightgrey.svg)

<br>
<img src="preview.gif" alt="Preview" >
<br>

## Cài đặt
Vô Terminal,
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

**Cài đặt CSDL (Cơ sở dữ liệu - Database)**:
- Tự tạo CSDL postgres.
- Rồi vô [env](./backend/.env.local), sửa cái này:

```
DATABASE_URL="postgresql://postgres:mat-khau@localhost:5432/ten-csdl"
```

- Migrate CSDL:

```
npm run migrate
```

**Tạo dữ liệu mẫu để test**: 
- Vô [index.ts](./backend/src/index.ts), sửa thành `true`:
> Nhớ sửa lại thành `false` sau khi tạo xong, không là nó chạy dữ liệu liên tục.
```
IndexFactory.run(true);
```

**Chạy Unit Test**:

```
npm run test
```

### Frontend
```
cd frontend
npm install
npm run dev
```