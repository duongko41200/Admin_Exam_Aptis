import type { AuthProvider } from "react-admin";
import { fetchUtils } from "react-admin";
import { generateRole } from "../core/role/permissions";

const apiUrl = import.meta.env.VITE_API_URL;
const httpClient = fetchUtils.fetchJson;
const API_KEY =
  "4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556";

const authProvider: AuthProvider = {
  // authentication
  login: async (params) => {
    const { username, password } = params;

    try {
      const request = new Request(`${apiUrl}/access/login`, {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        }),
      });
      const response = await fetch(request);

      const data = await response.json();

      console.log("data", data);

      const user = data.metadata?.user;
      const tokens = data.metadata?.tokens;
      localStorage.setItem("userId", data.metadata?.user?._id);
      localStorage.setItem("accessToken", data.metadata?.tokens?.accessToken);
      localStorage.setItem("refreshToken", data.metadata?.tokens?.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.metadata.user));

      if (!user || !tokens?.accessToken) {
        return Promise.reject("Invalid response");
      }
  
      // const {
      //   metadata: {
      //     user: { _id },
      //     tokens: { accessToken, refreshToken }
      //   }
      // } = data

      // console.log('accessToken',accessToken)

      // Set cookie
      // document.cookie = `${HEADER.CLIENT_ID}=${_id}; path=/`
      // document.cookie = `${HEADER.AUTHORIZATION}=${accessToken}; path=/`
      // document.cookie = `${HEADER.REFRESHTOKEN}= ${refreshToken}; path=/`
      // let { password, ...userToPersist } = user;

      // window.location.reload();

      return Promise.resolve(data.metadata);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(generateRole(1));
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    console.log("user", user);

    return Promise.resolve({
      id: user._id,
      fullName: user.name,
    });
  },
};

export default authProvider;

// import { AuthProvider, HttpError } from "react-admin";
// import data from "./users.json";

// /**
//  * This authProvider is only for test purposes. Don't use it in production.
//  */
// export const authProvider: AuthProvider = {
//   login: ({ username, password }) => {
//     const user = data.users.find(
//       (u) => u.username === username && u.password === password
//     );

//     if (user) {
//       // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
//       let { password, ...userToPersist } = user;
//       localStorage.setItem("user", JSON.stringify(userToPersist));
//       return Promise.resolve();
//     }

//     return Promise.reject(
//       new HttpError("Unauthorized", 401, {
//         message: "Invalid username or password",
//       })
//     );
//   },
//   logout: () => {
//     localStorage.removeItem("user");
//     return Promise.resolve();
//   },
//   checkError: () => Promise.resolve(),
//   checkAuth: () =>
//     localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
//   getPermissions: () => {
//     return Promise.resolve(undefined);
//   },
//   getIdentity: () => {
//     const persistedUser = localStorage.getItem("user");
//     const user = persistedUser ? JSON.parse(persistedUser) : null;

//     return Promise.resolve(user);
//   },
// };

// export default authProvider;
