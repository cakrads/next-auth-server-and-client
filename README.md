This sample repo is next.js authentication in server (api-server) and client (ssr and client). The authentication using JWT.

## Getting Started

Run the development server:

```bash
pnpm run dev
# or
npm run dev
# or
yarn dev
```

### Check The Frontend

Open [http://localhost:3000](http://localhost:3000) with your browser to check it's run well or not in your device (:

### Check The API Server
After success run the server, test http post to create new user in this endpoint: `http://localhost:3000/api/auth/v1/register` with this payload:
```
// Body Json Content
{
  "email": "admin@gmail.com",
  "password": "test"
}
```

## Flow Authentication
### 1. Registration
Firstly User open Register Page - `http://localhost:3000/register`. User will input email and password. For the security purpose, the password will not directly insert to DB, instated of the hash + salt.
```
// password utils
export async function generatePassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash }; // will input hash & salt to DB.
}
```

### 2. Login 
#### 2.1 Matching Password
User can login in Login Page - `http://localhost:3000/login`. When user do Login, the password will converted to hash with current salt user has in DB. after that match it with current user hash in DB.
```
export async function checkHashPassword(
  user: { salt: string; hash: string },
  inputPassword: string
) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}

```
#### 2.2 Generate AccessToken and RefreshToken
After match, the system will create `accessToken` and `refreshToken`. The expired token between both token will be diffrent cause the refreshToken will be use for create new `accessToken` when the `accessToken` expired. Wait, How about the `refreshToken` expired? User should re-login to create new `accessToken` and `refreshToken`.



## Diffrent `/server` and `/src`
- `server/` : this folder responsible for the backend code or handle API, so all code which responsible to handle REST API will be here. But, the routes are still in `pages/api/*` folder. 
Because all the backend code is in `server/` folder, it will be easier in the future if we want to move the code to a separate server.

- `src/` : this folder acts as the frontend code, but the api routes still in `pages/api/*`.

## API Server 
The Api server code located in folder `/server` but rhe route to access API still in pages folder (`/src/pages/api/*`).

## Folder Structure For API Server
Here folder structure to this project:

```
├ public/
├ server/                       # all code to handle API will be here
| ├ config/                     # initial all api config, get from env
| | db/                         # responsible for communicate to db, ex: connect()
| |   db.ts                     # example use local variable
| ├ helpers/                    # middleware and another code which will help globally
| └ module/                      
|   ├ auth/
|   | └ v1/                     # versioning early will help us letter
|   |   ├ dto/                  # code for validate payload
|   |   ├ services/
|   |   |   auth.ts             # register, login, refreshToken, logout
|   |   |   token.ts            # verify Access Token and match with current DB
|   |   | utils/                # ex: generateJWT, verifyJWT, verifyHashPassword, etc
|   |   | api-handler.ts        # handle HTTP Method and call services
|   |   └ model.ts              # db query will be here
|   └ user/
|     └ v1/
|       | services/
|       |   user.ts             # listUser, and me. will need JWT Token to access 
|       | api-handler.ts        # handle HTTP Method and call services
|       └ model.ts              # db query will be here
├ src/                          # all code to handle client/show UI will in src
| | config/                     # initial all frontend config, get from env
| ├ pages/
| | └ api/                      # API route still use basic nextjs routes
| |   ├ auth/
| |   | └ v1/                   # will call module.auth.v1.apiHandler
| |   |     login.ts
| |   |     logout.ts
| |   |     refresh-token.ts
| |   |     register.ts
| |   └ user/
| |      └ v1/                  # will call module.user.v1.apiHandler
| |          list.ts
| |          me.ts
```


