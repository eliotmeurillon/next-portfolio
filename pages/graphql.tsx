import { GraphQLClient } from "graphql-request";

const GITHUB_API_URL = "https://api.github.com/graphql";

interface RepositoriesData {
  viewer: {
    repositories: {
      nodes: {
        name: string;
        description: string;
        url: string;
        updatedAt: string;
        primaryLanguage: {
          name: string;
          color: string;
        } | null;
        repositoryTopics: {
          nodes: {
            topic: {
              name: string;
            };
          }[];
        };
      }[];
    };
  };
}

export async function fetchRepositories(token: any) {
  const graphQLClient = new GraphQLClient(GITHUB_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
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

  const data = await graphQLClient.request<RepositoriesData>(query);

  return data.viewer.repositories.nodes;
}
