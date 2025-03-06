
import React from 'react';
import { Save } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface CategoryFormProps {
  editingCategory: { id: string, name: string } | null;
  newCategory: { id: string, name: string };
  onEditingCategoryChange: (field: 'id' | 'name', value: string) => void;
  onNewCategoryChange: (field: 'id' | 'name', value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  newCategory,
  onEditingCategoryChange,
  onNewCategoryChange,
  onSave,
  onCancel
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-muted/30 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-id" className="block text-sm font-medium mb-1">
              {t('admin.categoryId')}
            </label>
            <input
              id="category-id"
              type="text"
              value={editingCategory ? editingCategory.id : newCategory.id}
              onChange={(e) => {
                if (editingCategory) {
                  onEditingCategoryChange('id', e.target.value);
                } else {
                  onNewCategoryChange('id', e.target.value);
                }
              }}
              readOnly={!!editingCategory}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="building"
            />
          </div>
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium mb-1">
              {t('admin.categoryName')}
            </label>
            <input
              id="category-name"
              type="text"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => {
                if (editingCategory) {
                  onEditingCategoryChange('name', e.target.value);
                } else {
                  onNewCategoryChange('name', e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="Construção"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={onSave}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Save size={18} />
            {editingCategory ? t('admin.update') : t('admin.add')}
          </button>
          {editingCategory && (
            <button
              onClick={onCancel}
              className="bg-muted px-4 py-2 rounded-md"
            >
              {t('admin.cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
