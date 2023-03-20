import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient } from "graphql-request";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const graphQLClient = new GraphQLClient("https://api.github.com/graphql", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    });

    const query = `
  query {
    viewer {
      repositories(first: 100, orderBy: { field: NAME, direction: ASC }) {
        nodes {
          id
          name
          description
          url
          updatedAt
          primaryLanguage {
            name
            color
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

    const {
      viewer: {
        repositories: { nodes },
      },
    } = await graphQLClient.request<{
      viewer: {
        repositories: {
          nodes: Repo[];
        };
      };
    }>(query);

    const { data: existingRepos, error: fetchError } = await supabase
      .from("repos")
      .select("name,id");

    if (fetchError) {
      console.error(fetchError);
      return res.status(500).json({ error: "Internal server error" });
    }

    const lastRepoId = existingRepos?.[existingRepos?.length - 1]?.id || "0";
    let nextId = Number(lastRepoId) + 1;

    const newNodes = nodes.filter((node) => {
      if (existingRepos?.some((repo) => repo.name === node.name)) {
        console.log(`Skipping ${node.name} because it already exists`);
        return false;
      }

      node.id = nextId.toString();
      nextId++;

      return true;
    });

    const { error: insertError } = await supabase
      .from("repos")
      .insert(newNodes);

    if (insertError) {
      console.log(insertError);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res
      .status(200)
      .json({ message: "Repositories inserted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving repositories" });
  }
}
