import { GraphQLClient } from "graphql-request";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

interface Repository {
  name: string;
  description: string | null;
  url: string;
  primmaryLanguage: {
    name: string | null;
    color: string | null;
  };
  repositoryTopics: {
    nodes: {
      topic: {
        name: string | null;
      };
    }[];
  };
}

interface Viewer {
  repositories: {
    nodes: Repository[];
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

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
          repositories(first: 100) {
            nodes {
              name
              description
              url
              primaryLanguage {
                name
                color
              }
              repositoryTopics(first: 100) {
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

    const { viewer } = await graphQLClient.request<{ viewer: Viewer }>(query);

    const { data: repos, error } = await supabase
      .from("repos")
      .insert(viewer.repositories.nodes);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      message:
        "Les dépôts ont été récupérés avec succès et stockés dans la base de données Supabase.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des dépôts et du stockage dans la base de données Supabase.",
    });
  }
}
