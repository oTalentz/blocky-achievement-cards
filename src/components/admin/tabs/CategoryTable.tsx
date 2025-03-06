
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Category {
  id: string;
  name: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">{t('admin.id')}</th>
            <th className="text-left px-4 py-3 font-medium">{t('admin.name')}</th>
            <th className="px-4 py-3 font-medium text-right">{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-muted/20">
              <td className="px-4 py-3">{category.id}</td>
              <td className="px-4 py-3">{category.name}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(category)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                    disabled={category.id === 'all'}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(category.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted"
                    disabled={category.id === 'all'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
