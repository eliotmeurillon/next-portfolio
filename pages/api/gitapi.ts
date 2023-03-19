import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient } from "graphql-request";

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

    const data = await graphQLClient.request<{
      viewer: {
        repositories: {
          nodes: Repo[];
        };
      };
    }>(query);

    res.status(200).json(data.viewer.repositories.nodes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des repositories" });
  }
}
