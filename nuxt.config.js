import colors from "vuetify/es5/util/colors";

export default {
  server: {
    port: 41602,
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - hr.agentsoncloud.com",
    title: "hr.agentsoncloud.com",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["assets/styles/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/vue-apexchart.js", ssr: false },
    "~/requestBuilder",
  ],

  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    ["@nuxtjs/dotenv", { systemvars: true }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
  proxy: {
    // "/hr/": {
    //   target: "http://localhost:30262/",
    //   pathRewrite: { "^/hr/": "" },
    // },
    // "/b
    // "/api-gateway/": {
    //   // https://odd-goat-41.app.smartmock.io
    //   // http://localhost:3500
    //   target: "https://api.development.agentsoncloud.com/external/public",
    //   pathRewrite: { "^/api-gateway/": "" },
    // },
    // "/api-gateway-local/": {
    //   target: "http://localhost:50001/external/public",
    //   pathRewrite: { "^/api-gateway-local/": "" },
    // },
    // "/api-gateway/": {
    //   target: "https://api.development.agentsoncloud.com/external/public",
    //   pathRewrite: { "^/api-gateway/": "" },
    // },
    // "/api-gateway-test/": {
    //   target: "https://api.test.agentsoncloud.com/external/public",
    //   pathRewrite: { "^/api-gateway-test/": "" },
    // },
    // "/api-gateway-pre-production/": {
    //   target: "https://api.prepro.agentsoncloud.com/external/public",
    //   pathRewrite: { "^/api-gateway-pre-production/": "" },
    // },
    // "/api-gateway-production/": {
    //   target: "https://api.agentsoncloud.com/external/public",
    //   pathRewrite: { "^/api-gateway-production/": "" },
    // },

    "/api-gateway-local/": {
      target: "http://localhost:50000/external/public",
      pathRewrite: { "^/api-gateway-local/": "" },
    },
    "/api-gateway/": {
      target: "https://api.development.agentsoncloud.com/external/public",
      pathRewrite: { "^/api-gateway/": "" },
    },
    "/api-gateway-test/": {
      target: "https://api.test.agentsoncloud.com/external/public",
      pathRewrite: { "^/api-gateway-test/": "" },
    },
    "/api-gateway-pre-production/": {
      target:
        "https://api.aoc.internal.preprod.agentsoncloud.com/external/public",
      pathRewrite: { "^/api-gateway-pre-production/": "" },
    },
    "/api-gateway-production/": {
      target: "https://api.agentsoncloud.com/external/public",
      pathRewrite: { "^/api-gateway-production/": "" },
    },
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: { vendor: ["vue-apexchart"] },
  transition: {
    name: "fade",
    mode: "out-in",
  },
};
