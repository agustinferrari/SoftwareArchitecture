module.exports = {
  apps: [
    {
      name: "consumer",
      script: "ts-node -P ./tsconfig.json ./consumer.ts",
    },
  ],
};
