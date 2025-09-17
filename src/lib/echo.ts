// import { useAuth } from "@/store/auth";
// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// (window as any).Pusher = Pusher;

// const { token } = useAuth.getState();

// const echo = new Echo({
//   broadcaster: "pusher",
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//   forceTLS: true,
//   authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`, // or omit if using cookies
//     },
//   },
// });

// export default echo;

import { useAuth } from "@/store/auth";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

const { token } = useAuth.getState();

// Enable Pusher debugging
Pusher.logToConsole = true;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

export default echo;
