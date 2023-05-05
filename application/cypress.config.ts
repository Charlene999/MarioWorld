import { defineConfig } from "cypress";

export default defineConfig({

  viewportWidth: 1800,
  viewportHeight: 1050,

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
