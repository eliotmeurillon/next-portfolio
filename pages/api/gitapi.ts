import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient } from "graphql-request";

interface Repo {
  id: string;
  name: string;
}

interface Response {
  viewer: {
    repositories: {
      nodes: {
        id: string;
        name: string;
      }[];
    };
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

    const data: Response = await graphQLClient.request(query);

    const repos: Repo[] = data.viewer.repositories.nodes.map((repo) => ({
      id: repo.id,
      name: repo.name,
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des repositories" });
  }
}
