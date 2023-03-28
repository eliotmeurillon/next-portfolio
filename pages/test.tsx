import { GetServerSideProps } from "next";
import { createClient } from "@supabase/supabase-js";

interface Post {
  id: string;
  name: string;
  url: string;
}

interface Props {
  jsonData: Post[];
}

const Test = ({ jsonData }: Props) => {
  return (
    <div>
      <h1>List of Posts</h1>
      {jsonData.map((post) => (
        <div key={post.id}>
          <h2>{post.name}</h2>
          <a href={post.url}>{post.url}</a>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  // set cache to last for one hour
  res.setHeader("Cache-Control", "public, max-age=3600");

  // fetch the data from Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const { data, error } = await supabase.from("repos").select("*");

  // convert the data to JSON format
  const jsonData = await JSON.parse(JSON.stringify(data));
  console.log(jsonData);

  return {
    props: {
      jsonData: jsonData,
    },
  };
};

export default Test;
