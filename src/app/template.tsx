export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-300 motion-reduce:animate-none">
      {children}
    </div>
  );
}
