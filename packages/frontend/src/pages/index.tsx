import Head from "next/head";
import { v4 as uuid } from "uuid";
import { useDatabase } from "../utils/useDatabase";

export default function Home() {
  const database = useDatabase();

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <pre>{JSON.stringify(database?.listEnvironments(), null, 2)}</pre>
      <button
        onClick={() => {
          database?.createEnvironment(uuid(), {
            id: uuid(),
          });
        }}
      >
        Create Environment
      </button>
    </div>
  );
}
