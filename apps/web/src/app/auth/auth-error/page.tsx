export default function AuthErrorPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Login error</h1>
      <p>
        The login link is invalid or has expired. Please request a new magic
        link.
      </p>
      <a href="/login">Back to login</a>
    </div>
  );
}
