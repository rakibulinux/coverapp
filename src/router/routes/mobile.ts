export default [
  {
    path: "/m",
    name: "Mobile",
    component: () => import("@/views/mobile/_index.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/views/mobile/_home.vue"),
      },
      {
        path: "exchange",
        component: () => import("@/views/mobile/_exchange.vue"),
      },
      {
        path: "markets",
        component: () => import("@/views/mobile/_markets.vue"),
        children: [
          {
            path: "preview/:market_id",
            component: () => import("@/views/mobile/screens/market-preview"),
          },
        ],
      },
      {
        path: "assets",
        component: () => import("@/views/mobile/_assets.vue"),
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "search",
            component: () => import("@/views/mobile/screens/assets/search.vue"),
          },
          {
            path: "deposit/:currency",
            component: () =>
              import("@/views/mobile/screens/assets/deposit.vue"),
          },
          {
            path: "withdraw/:currency",
            component: () =>
              import("@/views/mobile/screens/assets/withdraw.vue"),
          },
          {
            path: "preview/:currency",
            component: () =>
              import("@/views/mobile/screens/assets/preview.vue"),
          },
        ],
      },
      {
        path: "personal",
        component: () => import("@/views/mobile/_personal.vue"),
      },
      {
        path: "auth",
        component: () => import("@/views/mobile/screens/auth/base.vue"),
        meta: {
          guest: true,
        },
        children: [
          {
            path: "login",
            component: () => import("@/views/mobile/screens/auth/login"),
          },
          {
            path: "signup",
            component: () => import("@/views/mobile/screens/auth/signup"),
          },
        ],
      },
    ],
    meta: {
      mobile: true,
    },
  },
];
