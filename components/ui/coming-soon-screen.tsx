export function ComingSoonScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <h1 className="text-7xl md:text-8xl font-bold p-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse drop-shadow-2xl">
            Coming Soon
          </h1>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-xl blur-md opacity-30 animate-pulse"></div>
        </div>

        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          We're working hard to bring you something amazing.
          <span className="block mt-2 font-semibold text-foreground">Stay tuned!</span>
        </p>

        <div className="flex justify-center space-x-3 mt-12">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce shadow-lg"></div>
          <div className="w-4 h-4 bg-secondary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}