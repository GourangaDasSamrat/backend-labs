import axios from "axios";
import { useEffect, useState } from "react";
import { JokeCard, SkeletonCard } from "./components";

const App = () => {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((res) => setJokes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#0b102a] to-[#140b2d] text-slate-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-14 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow">
          Coding Jokes with Love 💙
        </h1>
        <p className="mt-4 text-slate-400">
          Clean code. Bad jokes. Great vibes.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto grid gap-6">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading &&
          jokes.map((joke) => <JokeCard key={joke.id} joke={joke} />)}
      </div>
    </div>
  );
};

export default App;
