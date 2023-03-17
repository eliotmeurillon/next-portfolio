import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Switcher from "@/components/Switcher";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [localStorageAvailable, setLocalStorageAvailable] = useState(false);

  useEffect(() => {
    setLocalStorageAvailable(!!window.localStorage);
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-darkBlue-500 dark:text-white">
        <div className="flex justify-between items-center p-3">
          <h1>Welcome to Next.js!</h1>
          {localStorageAvailable && <Switcher />}
        </div>
      </header>
      <main>
        <div className="flex items-center justify-center bg-gray-100 dark:bg-darkBlue-600 h-screen">
          <h1 className="text-black dark:text-white">
            Design by Bertone by Eliot
          </h1>
        </div>
      </main>
    </>
  );
}
