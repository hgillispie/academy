export default function Section({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="mb-8">
      {(title ?? null) && <h2 className="text-xl font-medium mb-4">{title}</h2>}
      {children}
    </div>
  );
}
