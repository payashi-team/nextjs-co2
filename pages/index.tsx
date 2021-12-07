import type { NextPage } from "next";
import Head from "next/head";
import Dashboard from "../components/Dashboard";
import styles from "../styles/Home.module.css";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>USAOMOCHI</title>
        <meta name="description" content="Realtime CO2 Monitor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Typography variant="h3" component="h1">
          Welcome to{" "}
          <Link href="https://line.me/R/ti/p/%40444rlonw">USAOMOCHI!</Link>
        </Typography>
        <Dashboard />
      </main>
    </div>
  );
};

export default Home;
