export default function ElementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mt-[var(--fd-nav-height)] pt-20">{children}</div>;
}
