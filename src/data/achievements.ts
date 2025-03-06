
import { v4 as uuidv4 } from 'uuid';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  reward: string;
  category: "building" | "redstone" | "decoration" | "landscape" | "megaproject";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  image: string;
  unlocked?: boolean;
};

export const categories = [
  { id: "building", name: "Construção" },
  { id: "redstone", name: "Redstone" },
  { id: "decoration", name: "Decoração" },
  { id: "landscape", name: "Paisagismo" },
  { id: "megaproject", name: "Megaprojeto" }
];

export const rarities = [
  { id: "common", name: "Comum", color: "bg-rarity-common" },
  { id: "uncommon", name: "Incomum", color: "bg-rarity-uncommon" },
  { id: "rare", name: "Rara", color: "bg-rarity-rare" },
  { id: "epic", name: "Épica", color: "bg-rarity-epic" },
  { id: "legendary", name: "Lendária", color: "bg-rarity-legendary" }
];

// Generate unique UUIDs for initial achievements
export const achievements: Achievement[] = [
  {
    id: uuidv4(),
    title: "Lar Doce Lar",
    description: "Construa sua primeira casa com pelo menos um espaço para dormir, armazenamento e crafting.",
    requirements: "Construir uma casa com cama, baú e mesa de trabalho",
    reward: "Desbloqueia modelos básicos de casas",
    category: "building",
    rarity: "common",
    image: "/placeholder.svg",
    unlocked: true
  },
  {
    id: uuidv4(),
    title: "Arquiteto da Vila",
    description: "Renove completamente uma vila com pelo menos 5 casas em seu próprio estilo.",
    requirements: "Renovar 5 estruturas em uma vila",
    reward: "Desbloqueia decorações de vila",
    category: "building",
    rarity: "uncommon",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Arquiteto Moderno",
    description: "Construa uma casa moderna usando vidro, concreto e iluminação contemporânea.",
    requirements: "Usar blocos de concreto e pelo menos 20 blocos de vidro",
    reward: "Desbloqueia designs modernos",
    category: "building",
    rarity: "rare",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Artista de Pixel",
    description: "Crie uma arte de pixel usando blocos que seja pelo menos 16x16.",
    requirements: "Pixel art de pelo menos 16x16 blocos",
    reward: "Desbloqueia exemplos de pixel art",
    category: "decoration",
    rarity: "uncommon",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Paisagista",
    description: "Crie um jardim com pelo menos 8 tipos diferentes de plantas e flores.",
    requirements: "Usar 8 tipos de plantas em um único jardim",
    reward: "Desbloqueia designs de paisagismo",
    category: "decoration",
    rarity: "uncommon",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Engenheiro Redstone",
    description: "Crie um mecanismo de redstone complexo que utilize pelo menos 3 componentes diferentes.",
    requirements: "Usar pistões, repetidores e comparadores em um único mecanismo",
    reward: "Desbloqueia projetos avançados de redstone",
    category: "redstone",
    rarity: "rare",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Mestre Fazendeiro",
    description: "Crie uma fazenda automatizada para colheita de pelo menos 3 tipos de cultivos.",
    requirements: "Fazenda automática para 3+ cultivos",
    reward: "Desbloqueia designs de fazendas automatizadas",
    category: "redstone",
    rarity: "rare",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Engenheiro de Pontes",
    description: "Construa uma ponte impressionante que conecte duas áreas com pelo menos 30 blocos de distância.",
    requirements: "Ponte com comprimento mínimo de 30 blocos",
    reward: "Desbloqueia designs de pontes",
    category: "landscape",
    rarity: "rare",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Castelo Impressionante",
    description: "Construa um castelo completo com muralhas, torres e fosso.",
    requirements: "Construir um castelo com pelo menos 4 torres e muralha completa",
    reward: "Desbloqueia designs de estruturas medievais",
    category: "megaproject",
    rarity: "epic",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Arranha-Céu",
    description: "Construa um edifício com pelo menos 50 blocos de altura, com interiores decorados.",
    requirements: "Edifício de 50+ blocos de altura com interiores funcionais",
    reward: "Desbloqueia designs de arranha-céus",
    category: "megaproject",
    rarity: "epic",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Atlantis",
    description: "Construa uma base subaquática completamente funcional e decorada.",
    requirements: "Base subaquática com pelo menos 5 cômodos",
    reward: "Desbloqueia designs subaquáticos",
    category: "megaproject",
    rarity: "epic",
    image: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Mestre Construtor",
    description: "Complete todas as outras conquistas de construção para provar seu domínio.",
    requirements: "Desbloquear todas as outras conquistas",
    reward: "Título exclusivo de Mestre Construtor",
    category: "megaproject",
    rarity: "legendary",
    image: "/placeholder.svg"
  }
];
