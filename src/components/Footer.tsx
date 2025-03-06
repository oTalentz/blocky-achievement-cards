
import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-minecraft-dirt rounded-sm flex items-center justify-center border-2 border-black">
                <div className="w-6 h-6 bg-minecraft-grass rounded-sm border border-black"></div>
              </div>
              <h2 className="text-xl font-bold font-pixel tracking-wider">
                <span className="text-minecraft-gold">MC</span> Conquistas
              </h2>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Um sistema personalizado de conquistas para construtores de Minecraft. 
              Compartilhe suas construções e desbloqueie recompensas exclusivas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-pixel text-lg mb-4 text-minecraft-gold">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Início</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Conquistas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-pixel text-lg mb-4 text-minecraft-gold">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Tutoriais</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Galeria</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MC Conquistas. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Não afiliado à Mojang Studios ou Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
