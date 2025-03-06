
export type Achievement = {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'building' | 'redstone' | 'decoration' | 'landscape' | 'megaproject';
  image: string;
  requirements: string;
  reward: string;
  unlocked?: boolean;
};

export const achievements: Achievement[] = [
  {
    id: "first-house",
    title: "Lar Doce Lar",
    description: "Construa sua primeira casa com pelo menos um espaço para dormir, armazenamento e crafting.",
    rarity: "common",
    category: "building",
    image: "/placeholder.svg",
    requirements: "Construir uma casa com cama, baú e mesa de trabalho",
    reward: "Desbloqueia modelos básicos de casas",
    unlocked: true
  },
  {
    id: "village-renovation",
    title: "Arquiteto da Vila",
    description: "Renove completamente uma vila com pelo menos 5 casas em seu próprio estilo.",
    rarity: "uncommon",
    category: "building",
    image: "/placeholder.svg",
    requirements: "Renovar 5 estruturas em uma vila",
    reward: "Desbloqueia decorações de vila"
  },
  {
    id: "redstone-genius",
    title: "Engenheiro Redstone",
    description: "Crie um mecanismo de redstone complexo que utilize pelo menos 3 componentes diferentes.",
    rarity: "rare",
    category: "redstone",
    image: "/placeholder.svg",
    requirements: "Usar pistões, repetidores e comparadores em um único mecanismo",
    reward: "Desbloqueia projetos avançados de redstone"
  },
  {
    id: "garden-master",
    title: "Paisagista",
    description: "Crie um jardim com pelo menos 8 tipos diferentes de plantas e flores.",
    rarity: "uncommon",
    category: "decoration",
    image: "/placeholder.svg",
    requirements: "Usar 8 tipos de plantas em um único jardim",
    reward: "Desbloqueia designs de paisagismo"
  },
  {
    id: "castle-creator",
    title: "Castelo Impressionante",
    description: "Construa um castelo completo com muralhas, torres e fosso.",
    rarity: "epic",
    category: "megaproject",
    image: "/placeholder.svg",
    requirements: "Construir um castelo com pelo menos 4 torres e muralha completa",
    reward: "Desbloqueia designs de estruturas medievais"
  },
  {
    id: "modern-architect",
    title: "Arquiteto Moderno",
    description: "Construa uma casa moderna usando vidro, concreto e iluminação contemporânea.",
    rarity: "rare",
    category: "building",
    image: "/placeholder.svg",
    requirements: "Usar blocos de concreto e pelo menos 20 blocos de vidro",
    reward: "Desbloqueia designs modernos"
  },
  {
    id: "bridge-builder",
    title: "Engenheiro de Pontes",
    description: "Construa uma ponte impressionante que conecte duas áreas com pelo menos 30 blocos de distância.",
    rarity: "rare",
    category: "landscape",
    image: "/placeholder.svg",
    requirements: "Ponte com comprimento mínimo de 30 blocos",
    reward: "Desbloqueia designs de pontes"
  },
  {
    id: "pixel-artist",
    title: "Artista de Pixel",
    description: "Crie uma arte de pixel usando blocos que seja pelo menos 16x16.",
    rarity: "uncommon",
    category: "decoration",
    image: "/placeholder.svg",
    requirements: "Pixel art de pelo menos 16x16 blocos",
    reward: "Desbloqueia exemplos de pixel art"
  },
  {
    id: "skyscraper",
    title: "Arranha-Céu",
    description: "Construa um edifício com pelo menos 50 blocos de altura, com interiores decorados.",
    rarity: "epic",
    category: "megaproject",
    image: "/placeholder.svg",
    requirements: "Edifício de 50+ blocos de altura com interiores funcionais",
    reward: "Desbloqueia designs de arranha-céus"
  },
  {
    id: "farm-designer",
    title: "Mestre Fazendeiro",
    description: "Crie uma fazenda automatizada para colheita de pelo menos 3 tipos de cultivos.",
    rarity: "rare",
    category: "redstone",
    image: "/placeholder.svg",
    requirements: "Fazenda automática para 3+ cultivos",
    reward: "Desbloqueia designs de fazendas automatizadas"
  },
  {
    id: "underwater-base",
    title: "Atlantis",
    description: "Construa uma base subaquática completamente funcional e decorada.",
    rarity: "epic",
    category: "megaproject",
    image: "/placeholder.svg",
    requirements: "Base subaquática com pelo menos 5 cômodos",
    reward: "Desbloqueia designs subaquáticos"
  },
  {
    id: "ultimate-builder",
    title: "Mestre Construtor",
    description: "Complete todas as outras conquistas de construção para provar seu domínio.",
    rarity: "legendary",
    category: "megaproject",
    image: "/placeholder.svg",
    requirements: "Desbloquear todas as outras conquistas",
    reward: "Título exclusivo de Mestre Construtor"
  }
];

export const categories = [
  { id: "all", name: "Todas" },
  { id: "building", name: "Construção" },
  { id: "redstone", name: "Redstone" },
  { id: "decoration", name: "Decoração" },
  { id: "landscape", name: "Paisagismo" },
  { id: "megaproject", name: "Megaprojetos" }
];

export const rarities = [
  { id: "common", name: "Comum", color: "bg-rarity-common" },
  { id: "uncommon", name: "Incomum", color: "bg-rarity-uncommon" },
  { id: "rare", name: "Rara", color: "bg-rarity-rare" },
  { id: "epic", name: "Épica", color: "bg-rarity-epic" },
  { id: "legendary", name: "Lendária", color: "bg-rarity-legendary" }
];
