
import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { categories as originalCategories } from '../../../data/achievements';
import { toast } from 'sonner';
import CategoryForm from './CategoryForm';
import CategoryTable from './CategoryTable';
import RarityTable from './RarityTable';

const CategoriesTab: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([...originalCategories]);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  
  const handleEditingCategoryChange = (field: 'id' | 'name', value: string) => {
    if (editingCategory) {
      setEditingCategory({...editingCategory, [field]: value});
    }
  };

  const handleNewCategoryChange = (field: 'id' | 'name', value: string) => {
    setNewCategory({...newCategory, [field]: value});
  };

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

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleEditCategory = (category: {id: string, name: string}) => {
    setEditingCategory(category);
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
        
        <CategoryForm 
          editingCategory={editingCategory}
          newCategory={newCategory}
          onEditingCategoryChange={handleEditingCategoryChange}
          onNewCategoryChange={handleNewCategoryChange}
          onSave={handleSaveCategory}
          onCancel={handleCancelEdit}
        />
        
        <CategoryTable 
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">{t('admin.rarities')}</h3>
        <RarityTable />
      </div>
    </div>
  );
};

export default CategoriesTab;
