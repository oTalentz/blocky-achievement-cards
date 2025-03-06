
import React from 'react';
import { Achievement, categories, rarities } from '../../../data/achievements';
import { Pencil, Trash, Eye, ImageIcon } from 'lucide-react';

interface AchievementListProps {
  achievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onPreview: (achievement: Achievement) => void;
  onImageChange: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  onEdit,
  onDelete,
  onPreview,
  onImageChange
}) => {
  return (
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
                      src={achievement.image} 
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <ImageIcon size={16} className="text-white" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onImageChange(achievement.id, e)}
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
                      onClick={() => onPreview(achievement)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => onEdit(achievement)}
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta conquista?')) {
                          onDelete(achievement.id);
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
  );
};

export default AchievementList;
