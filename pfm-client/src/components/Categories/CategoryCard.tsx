import React from 'react';

interface Category {
  id: string;
  name: string;
  type: string;
  color?: string;
  icon?: string;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {category.icon && (
            <span className="text-2xl" aria-hidden="true">{category.icon}</span>
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.type}</p>
          </div>
        </div>
        {category.color && (
          <span
            className="inline-block w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: category.color }}
            aria-label="Category color"
          />
        )}
      </div>
      {category.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
      )}
      <div className="flex gap-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(category)}
            className="flex-1 px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(category.id)}
            className="flex-1 px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/80"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
