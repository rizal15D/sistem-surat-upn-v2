export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div
        className={`h-screen w-screen relative`}
        style={{
          backgroundImage: `url(/images/auth/background.jpg)`,
          backgroundSize: `100% 100%`,
          backgroundPosition: `center`,
        }}
      >
        {children}
      </div>
    </main>
  );
}
