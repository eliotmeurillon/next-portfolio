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

export default function Fetch() {
  const [repos, setRepos] = useState<Repo[]>([]);

  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRepos() {
      const response = await fetch("/api/gitapi");
      const data: Repo[] = await response.json();
      setRepos(data);
    }
    fetchRepos();
  }, []);

  useEffect(() => {
    if (carousel.current) {
      setWidth(
        carousel.current.scrollWidth - carousel.current.offsetWidth + 10
      );
    }
  }, [repos]);

  return (
    <div className="bg-gray-200">
      <h1 className="text-3xl font-bold underline">Mes Repositories GitHub</h1>
      <motion.div
        ref={carousel}
        className="carousel overflow-hidden cursor-grabbing"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="inner-carousel flex"
        >
          {repos.map((repo) => (
            <motion.div
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
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
