import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Switcher from "@/components/Switcher";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import { HiDownload } from "react-icons/hi";
import { HiOutlineMail } from "react-icons/hi";
import { FiLinkedin } from "react-icons/fi";
import Test from "@/components/Test";

export default function Home({ supabase }) {
  const [localStorageAvailable, setLocalStorageAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");

  const handlePortfolioClick = () => {
    setActiveTab("portfolio");
  };

  const handleAboutClick = () => {
    setActiveTab("about");
  };

  useEffect(() => {
    setLocalStorageAvailable(!!window.localStorage);
    // sendTest(
    //   { supabase },
    //   "Mon premier test",
    //   "Ceci est un test pour supabase et nextjs"
    // );
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
        <div className="flex justify-between items-center p-3 h-16">
          <h1>Welcome to Next.js!</h1>
          {localStorageAvailable && <Switcher />}
        </div>
      </header>
      <main className="flex justify-center bg-gray-100 dark:bg-darkBlue-600 font-poppins ">
        <div className="py-[calc(1.5rem+4rem)] px-4  space-y-4 w-full md:max-w-3xl">
          <div className="flex flex-col text-left ">
            <h1 className="text-black dark:text-white text-3xl font-semibold">
              Eliot Meurillon
            </h1>
            <h2 className="text-black dark:text-white text-base font-normal">
              Développeur Full-Stack
            </h2>
          </div>
          <div className="flex flex-row justify-evenly py-3 px-3 space-x-3">
            <div className="flex flex-row items-center h-11 px-6 space-x-2 bg-green-500 rounded-lg">
              <button>Download CV</button>
              <HiDownload />
            </div>
            <button className="h-11 px-6 bg-white rounded-lg">
              <HiOutlineMail />
            </button>
            <button className="h-11 px-6 bg-white rounded-lg">
              <FiLinkedin />
            </button>
          </div>
          <div className="flex flex-row justify-evenly bg-white rounded-2xl py-3">
            <button
              className={`h-12 rounded-xl ${
                activeTab === "portfolio" ? "bg-gray-100" : ""
              }`}
              onClick={handlePortfolioClick}
            >
              Portfolio
            </button>
            <button
              className={`h-12 rounded-xl ${
                activeTab === "about" ? "bg-gray-100" : ""
              }`}
              onClick={handleAboutClick}
            >
              À propos
            </button>
          </div>
          {activeTab === "portfolio" && <Portfolio />}
          {activeTab === "about" && <About />}
          <Test supabase={supabase} />
        </div>
      </main>
    </>
  );
}
