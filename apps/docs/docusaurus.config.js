// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  plugins: [require("./plugin")],
  title: "Hello Worlds",
  tagline: "Virtual javascript worlds at planetary scales",
  url: "https://worlds.kenny.wtf",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  customFields: {
    LIVEBLOCKS_API_KEY: process.env.LIVEBLOCKS_API_KEY,
  },
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "kenjinp", // Usually your GitHub org/user name.
  projectName: "hello-worlds", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { name: "robots", content: "max-image-preview:large" },
        { property: "og:image", content: "/img/preview.png" },
        {
          property: "og:description",
          content: "Virtual javascript worlds at planetary scales",
        },
        { property: "twitter:image", content: "/img/preview.png" },
        {
          property: "titter:description",
          content: "Virtual javascript worlds at planetary scales",
        },
      ],
      defaultMode: "dark",
      navbar: {
        title: "Hello Worlds",
        logo: {
          alt: "Hello Worlds Logo",
          src: "img/favicon.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://ko-fi.com/kennywtf",
            position: "right",
            label: "Support this project",
          },
          {
            href: "https://github.com/kenjinp/hello-worlds",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Hello Worlds Discord",
                href: "https://discord.gg/7VqE93h58B",
              },
              {
                label: "Web Game Dev Discord",
                href: "https://discord.gg/xZAUSMgBU6",
              },
              {
                label: "Javelin Discord (gamedev & ECS)",
                href: "https://discord.gg/9qvBurTQwb",
              },
              {
                label: "Poimandres Discord (react graphics)",
                href: "https://discord.gg/papd8Abw5A",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/KennyPirman",
              },
              {
                label: "GitHub",
                href: "https://github.com/kenjinp/hello-worlds",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Kenneth Pirman`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
