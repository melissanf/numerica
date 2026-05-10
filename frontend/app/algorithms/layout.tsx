import Sidebar from '@/components/Sidebar';

export default function AlgorithmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-32">
        {children}
      </main>
    </div>
  );
}
