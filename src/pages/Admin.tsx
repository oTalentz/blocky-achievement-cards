
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Image, Folder, Tag, Settings, Save, Upload, PlusCircle, Trash2, Edit, Trophy } from 'lucide-react';
import { categories as originalCategories, rarities } from '../data/achievements';
import { toast } from 'sonner';
import AchievementManager from '../components/admin/AchievementManager';

type Tab = 'images' | 'categories' | 'settings' | 'achievements';

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('achievements');
  const [categories, setCategories] = useState([...originalCategories]);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  
  // If the user is not authenticated or not an admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-pixel mb-8 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          {t('admin.dashboard')}
        </h1>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <h2 className="text-xl font-pixel mb-4">{t('admin.menu')}</h2>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('achievements')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <Trophy size={18} />
                Conquistas
              </button>
              <button 
                onClick={() => setActiveTab('images')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'images' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <Image size={18} />
                {t('admin.images')}
              </button>
              <button 
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'categories' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <Folder size={18} />
                {t('admin.categories')}
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-2 ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <Settings size={18} />
                {t('admin.generalSettings')}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            {activeTab === 'achievements' && (
              <AchievementManager />
            )}
            
            {activeTab === 'images' && (
              <div>
                <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
                  <Image className="h-6 w-6" />
                  {t('admin.images')}
                </h2>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{t('admin.uploadImages')}</h3>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                      <Upload size={18} />
                      {t('admin.upload')}
                    </button>
                  </div>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">{t('admin.dragImages')}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.supportedFormats')}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('admin.imageLibrary')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">{t('admin.noImages')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
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
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-pixel mb-6 flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  {t('admin.generalSettings')}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('admin.siteSettings')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="site-title" className="block text-sm font-medium mb-1">
                          {t('admin.siteTitle')}
                        </label>
                        <input
                          id="site-title"
                          type="text"
                          defaultValue="MC Conquistas"
                          className="w-full px-3 py-2 border border-border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="site-description" className="block text-sm font-medium mb-1">
                          {t('admin.siteDescription')}
                        </label>
                        <textarea
                          id="site-description"
                          rows={3}
                          defaultValue="Plataforma de conquistas para jogadores de Minecraft"
                          className="w-full px-3 py-2 border border-border rounded-md resize-none"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                          <Save size={18} />
                          {t('admin.saveChanges')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
