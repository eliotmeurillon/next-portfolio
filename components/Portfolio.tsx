import { useState, useEffect } from "react";
import Image from "next/image";
import { DiReact } from "react-icons/di";
import { DiPython } from "react-icons/di";
import { RxCross2 } from "react-icons/rx";

interface Repos {
  id: string;
  name: string;
  description?: string;
  url: string;
  updatedAt: string;
  primary_language_name?: string;
  repositoryTopics?: string[];
  illu_url: string | null;
}

interface Props {
  jsonRepos: Repos[];
}

const Repos = ({ jsonRepos }: Props) => {
  const [filteredRepos, setFilteredRepos] = useState<Repos[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

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
      setFilteredRepos(jsonRepos);
    } else {
      setFilteredRepos(
        jsonRepos.filter((repo) => {
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
  }, [jsonRepos, selectedTopic]);

  return (
    <div>
      <div className="carousel overflow-hidden cursor-grabbing">
        <div className="inner-carousel flex flex-col">
          <div className="flex flex-row gap-1 w-full justify-center">
            <button
              className={`flex flex-row items-center rounded-lg bg-white dark:bg-darkBlue-500 dark:text-white ${
                selectedTopic === "react"
                  ? "border-2 border-green-500"
                  : "border-2 border-transparent"
              } `}
              onClick={() => {
                setSelectedTopic("react");
                if (typeof localStorage !== "undefined") {
                  localStorage.setItem("selectedTopic", "react");
                }
              }}
            >
              <DiReact />
              <p>React</p>
            </button>
            <button
              className={`flex flex-row items-center rounded-lg bg-white dark:bg-darkBlue-500  dark:text-white ${
                selectedTopic === "typescript"
                  ? "border-2 border-green-500"
                  : "border-2 border-transparent"
              } `}
              onClick={() => {
                setSelectedTopic("typescript");
                if (typeof localStorage !== "undefined") {
                  localStorage.setItem("selectedTopic", "typescript");
                }
              }}
            >
              <DiPython />
              <p>TypeScript</p>
            </button>
            <button
              className="flex flex-row items-center rounded-lg bg-white dark:bg-darkBlue-500 dark:text-white"
              onClick={() => {
                setSelectedTopic("");
                if (typeof localStorage !== "undefined") {
                  localStorage.removeItem("selectedTopic");
                }
              }}
            >
              <RxCross2 />
              <p>Clear Filter</p>
            </button>
          </div>
          {filteredRepos &&
            filteredRepos.map((repo) => (
              <div
                className="item p-3 m-3 min-w-fit bg-transparent dark:bg-darkBlue-500 dark:text-white"
                key={repo.id}
              >
                {repo.illu_url ? (
                  <Image
                    className="rounded-lg"
                    src={repo.illu_url}
                    width={1000}
                    height={1000}
                    alt="illustration"
                  />
                ) : (
                  <p>no image</p>
                )}
                <ul className="inline-flex space-x-2 text-xs font-bold text-green-500">
                  {repo.repositoryTopics?.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <h2 className="text-xl">{repo.name}</h2>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function Portfolio({ jsonRepos }: Props) {
  return <Repos jsonRepos={jsonRepos} />;
}
