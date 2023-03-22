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
  illu_url: null;
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

    const { viewer } = await graphQLClient.request<{ viewer: Viewer }>(query);

    const { data: existingNames, error: selectError } = await supabase
      .from("repos")
      .select("name");

    if (selectError) {
      throw new Error(selectError.message);
    }

    const newRepos = viewer.repositories.nodes.filter((repo) => {
      return !existingNames.some((name : any) => name === repo.name);
    });

    if (newRepos.length === 0) {
      res.status(200).json({
        message: "Aucun nouveau dépôt à ajouter.",
      });
      return;
    }

    const { data: insertResult, error: insertError } = await supabase
      .from("repos")
      .insert(newRepos);

    if (insertError) {
      throw new Error(insertError.message);
    }

    res.status(200).json({
      message: `${newRepos.length} nouveaux dépôts ont été ajoutés avec succès.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des dépôts et du stockage dans la base de données Supabase.",
    });
  }
}
