
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Folder, Save, Edit, Trash2 } from 'lucide-react';
import { categories as originalCategories, rarities } from '../../data/achievements';
import { toast } from 'sonner';

const CategoryManager: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([...originalCategories]);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      toast.success('Categoria atualizada com sucesso!');
    } else if (newCategory.id && newCategory.name) {
      if (categories.some(cat => cat.id === newCategory.id)) {
        toast.error('Já existe uma categoria com este ID');
        return;
      }
      setCategories([...categories, newCategory]);
      setNewCategory({ id: '', name: '' });
      toast.success('Categoria adicionada com sucesso!');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      toast.error('Não é possível remover a categoria padrão');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Categoria removida com sucesso!');
  };

  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
        <Folder className="h-6 w-6" />
        {t('admin.categories')}
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{t('admin.manageCategories')}</h3>
        
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
                      setEditingCategory({...editingCategory, id: e.target.value});
                    } else {
                      setNewCategory({...newCategory, id: e.target.value});
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
                      setEditingCategory({...editingCategory, name: e.target.value});
                    } else {
                      setNewCategory({...newCategory, name: e.target.value});
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Construção"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={handleSaveCategory}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Save size={18} />
                {editingCategory ? t('admin.update') : t('admin.add')}
              </button>
              {editingCategory && (
                <button
                  onClick={() => setEditingCategory(null)}
                  className="bg-muted px-4 py-2 rounded-md"
                >
                  {t('admin.cancel')}
                </button>
              )}
            </div>
          </div>
        </div>
        
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
                        onClick={() => setEditingCategory(category)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                        disabled={category.id === 'all'}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
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
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('admin.rarities')}</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">{t('admin.id')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('admin.name')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('admin.color')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rarities.map((rarity) => (
                <tr key={rarity.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">{rarity.id}</td>
                  <td className="px-4 py-3">{rarity.name}</td>
                  <td className="px-4 py-3">
                    <div className={`w-6 h-6 rounded-full ${rarity.color}`}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
