import { useState, useEffect } from "react";

interface Repo {
  id: string;
  name: string;
  description?: string;
  url: string;
  updatedAt: string;
  primaryLanguage?: {
    name: string;
    color: string;
  };
  repositoryTopics?: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
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
            <a href={repo.url}>Visit Repo</a>
            <ul>
              {repo.repositoryTopics?.nodes?.map((topic) => (
                <li key={topic.topic.name}>{topic.topic.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
