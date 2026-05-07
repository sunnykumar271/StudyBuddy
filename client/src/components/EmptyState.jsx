const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    {Icon && (
      <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
