import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

interface Test {
  id: string;
  title: string;
  content: string;
}

export default function Fetch({ supabase }: any) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    async function getRepos() {
      const { data: repos, error } = await supabase
        .from("repos")
        .select("*")
        .order("name", { ascending: true });
      if (error) console.error(error);
      if (repos) setRepos(repos);
    }
    getRepos();
  }, []);

  useEffect(() => {
    if (selectedTopic === "") {
      setFilteredRepos(repos);
    } else {
      const filtered = repos.filter((repo) =>
        repo.repositoryTopics?.nodes?.some(
          (topic) => topic.topic.name === selectedTopic
        )
      );
      setFilteredRepos(filtered);
    }
  }, [repos, selectedTopic]);

  return (
    <div>
      <div className="carousel overflow-hidden cursor-grabbing">
        <div className="inner-carousel flex flex-col">
          <div>
            <button onClick={() => setSelectedTopic("react")}>React</button>
            <button onClick={() => setSelectedTopic("typescript")}>
              TypeScript
            </button>
            <button onClick={() => setSelectedTopic("")}>Clear Filter</button>
          </div>
          {filteredRepos.map((repo) => (
            <div
              className="item rounded-lg shadow-lg p-3 m-3 min-w-fit bg-white"
              key={repo.id}
            >
              <h2 className="text-xl">{repo.name}</h2>
              <p>{repo.description}</p>
              <a
                className="text-base"
                target="_blank"
                rel="noopener"
                href={repo.url}
              >
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
