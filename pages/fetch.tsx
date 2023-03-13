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
    <div className="bg-gray-200">
      <h1 className="text-3xl font-bold underline">Mes Repositories GitHub</h1>
      <ul className="">
        {repos.map((repo) => (
          <li className="rounded-lg shadow-lg m-3 bg-white" key={repo.id}>
            <h2 className="text-xl">{repo.name}</h2>
            <p>{repo.description}</p>
            <a className="text-base" href={repo.url}>
              Visit Repo
            </a>
            <ul>
              {repo.repositoryTopics?.nodes?.map((topic) => (
                <li
                  className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                  key={topic.topic.name}
                >
                  {topic.topic.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
