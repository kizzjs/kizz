var context = {},
    app = new (require("beads"))(context),
    pluginManager = new (require("./lib/pluginManager"));

pluginManager.activate("./config");