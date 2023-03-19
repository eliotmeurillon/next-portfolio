import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

interface Test {
  id: string;
  title: string;
  content: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Test[]>
) {
  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  } else {
    res.status(200).json(data);
  }
}
