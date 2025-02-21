import Layout from "./shared/layout";

export default function SignInPage() {
  return (
    <Layout>
      <div id="auth"></div>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js"></script>
      ) : (
        <script type="module" src="/client/pages/sign-in.tsx"></script>
      )}
    </Layout>
  );
}
