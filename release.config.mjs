export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/benbis-dev/glotterfly.git",
  tagFormat: "v${version}",

  plugins: [
    "@semantic-release/commit-analyzer",

    [
      "@semantic-release/release-notes-generator",
      {
        host: "https://github.com",
      },
    ],

    [
      "@semantic-release/exec",
      {
        prepareCmd: "node scripts/sync-release-version.mjs ${nextRelease.version}",
      },
    ],

    [
      "@semantic-release/git",
      {
        assets: ["package.json", "apps/extension/package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}\n\nSigned-off-by: Tai Benvenuti <taibenvenuti@gmail.com>",
      },
    ],

    [
      "@semantic-release/github",
      {
        successCommentCondition: false,
        failCommentCondition: false,
      },
    ],
  ],
};
