import { Search, X } from "lucide-react";

interface SearchBannerProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBanner = ({ searchTerm, setSearchTerm }: SearchBannerProps) => {
  return (
    <div className="bg-primary/5 border-b border-primary/10 dark:border-white/10 py-4 sticky top-[72px] md:top-[88px] z-40 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary/60 dark:text-white/40 group-focus-within:text-primary dark:group-focus-within:text-white/70 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-3 bg-card border-2 border-primary/20 dark:bg-[#1e1e1e] dark:border dark:border-white/20 rounded-2xl leading-5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary dark:focus:ring-white/10 dark:focus:border-white/40 transition-all shadow-sm"
            placeholder="¿Qué estás buscando hoy?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBanner;
