export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex items-center justify-center h-screen w-screen p-4 md:p-6 2xl:p-10">
        {children}
      </div>
    </main>
  );
}
