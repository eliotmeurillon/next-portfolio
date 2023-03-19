import { useState, useEffect } from "react";

interface Test {
  id: string;
  title: string;
  content: string;
}

interface FetchProps {
  supabase: any;
}

export default function Fetch({ supabase }: FetchProps) {
  const [testRepos, setTestRepos] = useState<Test[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setTestRepos(data);
      }
    };

    fetchData();
  }, [supabase]);

  return (
    <div>
      {testRepos.map((test) => (
        <div key={test.id}>
          <h2>{test.title}</h2>
          <p>{test.content}</p>
        </div>
      ))}
    </div>
  );
}
