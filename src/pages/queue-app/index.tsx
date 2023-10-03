import TabletForm from "@/components/queue-app/TabletForm";
import TabletHeader from "@/components/queue-app/TabletHeader";
import Head from "next/head";

export default function Index() {
  return (
    <main className="Inter">
      <Head>
        <title>GSCWD - QMaster</title>
      </Head>
      <div className="w-screen h-screen p-5 bg-blue-100">
        <div className="grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-5 md:grid-cols-2 md:grid-rows-1 sm:grid-cols-1 gap-2">
          <TabletHeader />
          <div className="flex flex-col items-center justify-center bg-blue-300 rounded-t-none rounded-2xl">
            <div className="flex flex-col gap-5 m-5 p-5">
              <TabletForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// export default index;
