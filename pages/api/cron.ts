// Importer les dépendances nécessaires
import { GraphQLClient } from "graphql-request";
import { createClient } from "@supabase/supabase-js";

interface Repository {
  name: string;
  description: string | null;
  url: string;
}

interface Viewer {
  repositories: {
    nodes: Repository[];
  };
}

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction principale qui récupère les dépôts de l'utilisateur GitHub et les stocke dans Supabase
const handler = async (req: any, res: any) => {
  try {
    // Initialiser le client GraphQL avec l'URL de l'API GitHub
    const graphQLClient = new GraphQLClient("https://api.github.com/graphql", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    });

    // Définir la requête GraphQL pour récupérer les dépôts de l'utilisateur GitHub
    const query = `
      query {
        viewer {
          repositories(first: 100) {
            nodes {
              name
              description
              url
            }
          }
        }
      }
    `;

    // Envoyer la requête GraphQL et récupérer les dépôts de l'utilisateur GitHub
    const { viewer } = await graphQLClient.request<{ viewer: Viewer }>(query);

    // Stocker les dépôts dans Supabase
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
    res.status(500).json({ message: "Une erreur s'est produite." });
  }
};
