import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

interface Repo {
  id: string;
  name: string;
  description?: string;
  url: string;
  updatedAt: string;
  primary_language_name?: string;
  primary_language_color?: string;
  repositoryTopics?: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
  illu_url: string;
}

interface Props {
  repos: Repo[];
}

export default function Fetch({ repos }: Props) {
  const [filteredRepos, setFilteredRepos] = useState<Repo[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  function filterRepos() {
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
  }

  return (
    <div>
      <div className="carousel overflow-hidden cursor-grabbing">
        <div className="inner-carousel flex flex-col">
          <div>
            <button
              onClick={() => {
                setSelectedTopic("react");
                filterRepos();
              }}
            >
              React
            </button>
            <button
              onClick={() => {
                setSelectedTopic("typescript");
                filterRepos();
              }}
            >
              TypeScript
            </button>
            <button
              onClick={() => {
                setSelectedTopic("");
                filterRepos();
              }}
            >
              Clear Filter
            </button>
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
              <img src={repo.illu_url} alt="testillu" />
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

export async function getServerSideProps() {
  console.log("getServerSideProps");
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );
  const { data: repos, error } = await supabase
    .from("repos")
    .select("*")
    .order("name", { ascending: true });
  if (error) console.error(error);
  return {
    props: {
      repos: repos || [],
    },
  };
}
