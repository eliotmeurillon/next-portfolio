import { useState, useEffect } from "react";
import { fetchRepositories } from "./graphql";

interface Repository {
  name: string;
  description: string | null;
  url: string;
  updatedAt: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
}

function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = process.env.GITHUB_TOKEN;
      const repos = await fetchRepositories(token);
      setRepositories(repos);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {repositories.map((repo) => (
        <div key={repo.url}>
          <h3>{repo.name}</h3>
          <p>{repo.description}</p>
          <p>Last updated: {repo.updatedAt}</p>
          <p>
            Language:{" "}
            {repo.primaryLanguage ? repo.primaryLanguage.name : "Unknown"}
          </p>
          <p>
            Topics:{" "}
            {repo.repositoryTopics.nodes
              .map((node) => node.topic.name)
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Repositories;
