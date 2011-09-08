({
  dir: "../build",
  paths : {
    scrappit : "src/scrappit",
    requireLib : "lib/require"
  },
  modules: [
    { name: "scrappit-amd",
      include: ["requireLib", "scrappit"],
      create : true }
  ],
  optimize : "none",
  namespace : "scrappit",
  skipModuleInsertion: true, //to avoid requireLib definition
  optimizeAllPluginResources: false
})