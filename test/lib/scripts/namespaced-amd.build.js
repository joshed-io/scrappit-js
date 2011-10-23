({
  appDir: "../",
  baseUrl: "scripts",
  dir: "../../lib-namespaced-amd-build",
  paths : {
    requireLib : "require"
  },
  modules: [
    { name: "scrappit-amd-test",
      include: ["requireLib", "scrappit"],
      create : true }
  ],
  optimize : "none",
  namespace : "scrappitTestSuite",
  skipModuleInsertion: true,
  optimizeAllPluginResources: false
})