import app, { port } from "@/app";
import "dotenv/config";

// run app
app.listen(port, () => {
  console.log(`Server running locally on port ${port}`);
});
