import app from "./app";
import config from "./config";

const PORT = config.port || 5000;
async function main() {


  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Status check: http://localhost:${PORT}`);
  });
}
main();
