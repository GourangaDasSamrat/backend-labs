import "dotenv/config";
import app, { port } from "@/app";

// run app
app.listen(port, () => {
  console.log(`Server running locally on port ${port}`);
});
