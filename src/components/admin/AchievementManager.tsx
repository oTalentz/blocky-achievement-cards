import React, { useState } from 'react';
import { useAchievements } from '../../contexts/AchievementsContext';
import { Achievement, categories, rarities } from '../../data/achievements';
import { Pencil, Trash, PlusCircle, Image as ImageIcon, Save, X, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AchievementManager: React.FC = () => {
  const { 
    achievements, 
    pendingChanges,
    addAchievement, 
    updateAchievement, 
    deleteAchievement, 
    updateAchievementImage,
    confirmAllChanges
  } = useAchievements();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string | null>(null);
  
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: '',
    title: '',
    description: '',
    rarity: 'common',
    category: 'building',
    image: '/placeholder.svg',
    requirements: '',
    reward: '',
    unlocked: false
  });

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateAchievementImage(id, imageUrl);
    }
  };

  const handleNewAchievementChange = (field: keyof Achievement, value: any) => {
    setNewAchievement(prev => ({ ...prev, [field]: value }));
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setIsEditing(achievement.id);
    setNewAchievement(achievement);
  };

  const handleSaveEdit = () => {
    if (isEditing) {
      updateAchievement(newAchievement);
      setIsEditing(null);
    } else {
      if (!newAchievement.title || !newAchievement.description) {
        toast.error("Preencha os campos obrigatórios");
        return;
      }
      
      if (!newAchievement.id) {
        newAchievement.id = `achievement-${Date.now()}`;
      }
      
      addAchievement(newAchievement);
      
      setNewAchievement({
        id: '',
        title: '',
        description: '',
        rarity: 'common',
        category: 'building',
        image: '/placeholder.svg',
        requirements: '',
        reward: '',
        unlocked: false
      });
      
      setIsAdding(false);
    }
  };

  const handlePreview = (achievement: Achievement) => {
    setPreviewMode(achievement.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setIsAdding(false);
    setPreviewMode(null);
  };
  
  const handleConfirmAllChanges = () => {
    confirmAllChanges();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-pixel">Gerenciar Conquistas</h2>
        <div className="flex gap-3">
          {pendingChanges && (
            <button
              onClick={handleConfirmAllChanges}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Confirmar Alterações
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
            disabled={isAdding || isEditing !== null}
          >
            <PlusCircle size={18} />
            Adicionar Nova
          </button>
        </div>
      </div>
      
      {pendingChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <p>
            Você tem alterações pendentes que ainda não foram publicadas. 
            Clique em "Confirmar Alterações" para torná-las visíveis para todos os usuários.
          </p>
        </div>
      )}
      
      {(isAdding || isEditing) && (
        <div className="mb-8 bg-muted/30 rounded-lg p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isEditing ? "Editar Conquista" : "Adicionar Nova Conquista"}
            </h3>
            <button onClick={handleCancelEdit} className="text-muted-foreground hover:text-destructive">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => handleNewAchievementChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Título da conquista"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => handleNewAchievementChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md resize-none"
                  rows={3}
                  placeholder="Descrição da conquista"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={newAchievement.category}
                    onChange={(e) => handleNewAchievementChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Raridade</label>
                  <select
                    value={newAchievement.rarity}
                    onChange={(e) => handleNewAchievementChange('rarity', e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    {rarities.map(rarity => (
                      <option key={rarity.id} value={rarity.id}>
                        {rarity.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Requisitos</label>
                <textarea
                  value={newAchievement.requirements}
                  onChange={(e) => handleNewAchievementChange('requirements', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md resize-none"
                  rows={2}
                  placeholder="O que é necessário para desbloquear"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Recompensa</label>
                <textarea
                  value={newAchievement.reward}
                  onChange={(e) => handleNewAchievementChange('reward', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md resize-none"
                  rows={2}
                  placeholder="O que o jogador ganha ao desbloquear"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAchievement.unlocked || false}
                    onChange={(e) => handleNewAchievementChange('unlocked', e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span>Desbloqueada</span>
                </label>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Imagem</label>
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img 
                      key={`preview-${newAchievement.image}`}
                      src={newAchievement.image}
                      alt={newAchievement.title || "Nova conquista"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <label className="flex items-center justify-center gap-2 cursor-pointer bg-muted hover:bg-muted/80 transition-colors text-sm font-medium py-2 px-4 rounded-md w-full">
                      <ImageIcon size={16} />
                      <span>Alterar imagem</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            handleNewAchievementChange('image', imageUrl);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveEdit}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Imagem</th>
              <th className="text-left px-4 py-3 font-medium">Título</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Raridade</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {achievements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma conquista encontrada. Adicione uma nova conquista.
                </td>
              </tr>
            ) : (
              achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden">
                      <img 
                        key={`table-${achievement.id}-${achievement.image}`}
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <ImageIcon size={16} className="text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(achievement.id, e)}
                        />
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3">{achievement.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {categories.find(c => c.id === achievement.category)?.name || achievement.category}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${rarities.find(r => r.id === achievement.rarity)?.color}`}>
                      {rarities.find(r => r.id === achievement.rarity)?.name || achievement.rarity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handlePreview(achievement)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditAchievement(achievement)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta conquista?')) {
                            deleteAchievement(achievement.id);
                          }
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {previewMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 p-4">
          <div className="bg-card rounded-lg max-w-md w-full overflow-hidden relative">
            <button 
              onClick={() => setPreviewMode(null)} 
              className="absolute top-4 right-4 p-1 rounded-full bg-background/80 z-10 hover:bg-destructive/20 transition-colors"
            >
              <X size={20} />
            </button>
            
            {(() => {
              const achievement = achievements.find(a => a.id === previewMode);
              if (!achievement) return null;
              
              const rarityData = rarities.find(r => r.id === achievement.rarity);
              
              return (
                <div>
                  <div className={`h-40 relative bg-gradient-to-br ${rarityData?.color}`}>
                    <img 
                      src={achievement.image} 
                      alt={achievement.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h2 className="text-white text-3xl font-pixel drop-shadow-md">{achievement.title}</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${rarityData?.color} text-white`}>
                          {rarityData?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {categories.find(c => c.id === achievement.category)?.name}
                        </span>
                      </div>
                      <p className="text-sm">{achievement.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-pixel text-sm text-minecraft-gold mb-1">Requisitos:</h4>
                        <p className="text-xs text-muted-foreground">{achievement.requirements}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-pixel text-sm text-minecraft-emerald mb-1">Recompensa:</h4>
                        <p className="text-xs text-muted-foreground">{achievement.reward}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <button 
                        onClick={() => setPreviewMode(null)}
                        className="minecraft-btn text-sm py-1.5 px-6 bg-muted hover:bg-muted/80 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementManager;
