
import React from 'react';
import { rarities } from '../../../data/achievements';
import { useLanguage } from '../../../contexts/LanguageContext';

const RarityTable: React.FC = () => {
  const { t } = useLanguage();

  return (
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
  );
};

export default RarityTable;
