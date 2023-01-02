This sample repo is next.js authentication in server (api-server) and client (ssr and client).

## Note: Frontend Code still in Development

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

Do http post to create new user in this endpoint: `http://localhost:3000/api/auth/v1/register` with this payload:

```
// Body Json Content
{
  "email": "admin@gmail.com",
  "password": "test"
}
```

## Folder Structure

Here folder structure to this project:

```
├ public/
├ server/                       # all code to handle API will be here
| | db/                         # responsible for communicate to db, ex: connect()
| |   db.ts                     # example use local variable
| ├ config/                     # initial all api config, get from env
| ├ helpers/                    # middleware and another which will help globally
| └ module/
|   ├ auth/
|   | └ v1/                     # versioning early will help us letter
|   |   | api-handler.ts        # handle HTTP Method and call services
|   |   | model.ts              # db query will be here
|   |   ├ dto/                  # code for validate payload
|   |   ├ services/
|   |   |   auth.ts             # register, login, refreshToken, logout
|   |   |   token.ts            # verify Access Token and match with current DB
|   |   └ utils/                # ex: generateJWT, verifyJWT, verifyHashPassword, etc
|   └ user/
|     └ v1/
|       | api-handler.ts        # handle HTTP Method and call services
|       | model.ts              # db query will be here
|       └ services/
|           user.ts             # listUser, and me. will need JWT Token to access
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

- `server/` : this folder responsible for the backend code or handle API, so all code which responsible to handle REST API will be here. But, the routes are still in `pages/api/*` folder.
  Because all the backend code is in `server/` folder, it will be easier in the future if we want to move the code to a separate server.

- `src/` : this folder acts as the frontend code, but the api routes still in `pages/api/*`.
