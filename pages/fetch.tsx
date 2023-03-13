import { useState, useEffect } from "react";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

export default function Fetch() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    async function fetchRepos() {
      const response = await fetch("/api/gitapi");
      const data: Repo[] = await response.json();
      setRepos(data);
    }
    fetchRepos();
  }, []);

  return (
    <div>
      <h1>Mes Repositories GitHub</h1>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <h2>{repo.name}</h2>
            <p>{repo.description}</p>
            <a href={repo.html_url}>Visit Repo</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
