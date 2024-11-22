import Header from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-full">
            <Header />
            {children}
        </div>
    );
  }