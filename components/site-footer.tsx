type FooterProps = {
  authorName: string;
};

export function SiteFooter({ authorName }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-[#f3efe8]/80 py-10">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-stone-500 sm:px-6">
        <p>© {new Date().getFullYear()} {authorName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
