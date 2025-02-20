import Layout from "./shared/layout";

export default function IndexPage() {
  return (
    <Layout>
      <div id="counter"></div>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js"></script>
      ) : (
        <script type="module" src="/client/counter.tsx"></script>
      )}
    </Layout>
  );
}
