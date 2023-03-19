import fs from "fs";
import path from "path";
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

const filePath = path.join(process.cwd(), "json", "repos.json");

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

    // Read existing data from the file
    let existingData: Repo[] = [];
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
      console.error("Error reading data from file", error);
    }

    // Merge new data with existing data, excluding duplicates
    const newData = [
      ...existingData,
      ...data.viewer.repositories.nodes.filter(
        (repo) =>
          !existingData.some((existingRepo) => existingRepo.id === repo.id)
      ),
    ];

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(newData), (err) => {
      if (err) {
        console.error("Error writing data to file", err);
        res.status(500).json({ message: "Error writing data to file" });
      } else {
        res.status(200).json(newData);
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching repositories from GitHub API" });
  }
}
