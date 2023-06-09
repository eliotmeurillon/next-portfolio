import { GraphQLClient } from "graphql-request";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

interface Repository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: {
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
              id
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

    const repos = viewer.repositories.nodes.map((repo) => ({
      repo_id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.url,
      primary_language_name: repo.primaryLanguage?.name ?? null,
      primary_language_color: repo.primaryLanguage?.color ?? null,
      repositoryTopics: repo.repositoryTopics.nodes.map((node) => node.topic.name),
    }));

    console.log(repos);

    const { data, error } = await supabase
      .from("repos")
      .upsert(repos, { onConflict: 'repo_id' })
      //  .insert(repos)
      .select();

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
