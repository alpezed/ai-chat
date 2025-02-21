import Layout from "./shared/layout";

export default function SignUpPage() {
  return (
    <Layout>
      <div id="auth"></div>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js"></script>
      ) : (
        <script type="module" src="/client/pages/sign-up.tsx"></script>
      )}
    </Layout>
  );
}
