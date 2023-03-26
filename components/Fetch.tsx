import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Repo {
  id: string;
  name: string;
  description?: string;
  url: string;
  updatedAt: string;
  primary_language_name?: string;
  repositoryTopics?: string[];
  illu_url: string;
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
    if (typeof localStorage !== "undefined") {
      const selectedTopicLocalStorage = localStorage.getItem("selectedTopic");
      if (selectedTopicLocalStorage !== null) {
        setSelectedTopic(selectedTopicLocalStorage);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTopic === "") {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(
        repos.filter((repo) => {
          return (
            repo.primary_language_name?.toLowerCase() ===
              selectedTopic.toLowerCase() ||
            (repo.repositoryTopics?.findIndex((node) => {
              return node.toLowerCase() === selectedTopic.toLowerCase();
            }) !== -1 &&
              repo.primary_language_name?.toLowerCase() !== "typescript")
          );
        })
      );
    }
  }, [selectedTopic, repos]);

  return (
    <div>
      <div className="carousel overflow-hidden cursor-grabbing">
        <div className="inner-carousel flex flex-col">
          <div>
            <button
              onClick={() => {
                setSelectedTopic("react");
                if (typeof localStorage !== "undefined") {
                  localStorage.setItem("selectedTopic", "react");
                }
              }}
            >
              React
            </button>
            <button
              onClick={() => {
                setSelectedTopic("typescript");
                if (typeof localStorage !== "undefined") {
                  localStorage.setItem("selectedTopic", "typescript");
                }
              }}
            >
              TypeScript
            </button>
            <button
              onClick={() => {
                setSelectedTopic("");
                if (typeof localStorage !== "undefined") {
                  localStorage.removeItem("selectedTopic");
                }
              }}
            >
              Clear Filter
            </button>
          </div>
          {filteredRepos &&
            filteredRepos.map((repo) => (
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
                <img src={repo.illu_url} alt="testillu" />
                <ul>
                  {repo.repositoryTopics?.map((topic) => (
                    <li
                      className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                      key={topic}
                    >
                      {topic}
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
