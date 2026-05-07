const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-4 border-secondary/20 border-t-secondary
                    rounded-full animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
