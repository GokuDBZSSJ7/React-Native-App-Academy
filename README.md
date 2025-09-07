# 🎯 Level Up Gym

Um aplicativo React Native moderno e elegante que transforma seus treinos de academia em um sistema de leveling, inspirado no conceito de "Upar de Nivel" - onde cada exercício tem seu próprio nível e XP.

## ✨ Funcionalidades

### 🏋️ Sistema de Leveling
- **XP por Exercício**: Cada exercício tem seu próprio nível e XP
- **Progressão Exponencial**: XP necessário aumenta a cada nível
- **Bônus por Performance**: Mais peso e repetições = mais XP
- **Streak Bonus**: Mantenha uma sequência de treinos para bônus

### 💪 Gerenciamento de Exercícios
- Adicione exercícios personalizados
- Categorize por grupo muscular
- Acompanhe progresso individual
- Visualize estatísticas por exercício

### 📅 Sistema de Treinos
- Organize treinos por dia da semana
- Crie rotinas personalizadas
- Registre sessões de treino
- Acompanhe histórico de treinos

### 📊 Estatísticas e Conquistas
- XP total e nível geral
- Sequência de treinos
- Conquistas desbloqueadas
- Tempo total de treino
- Histórico de sessões recentes

### 💾 Persistência de Dados
- **Salvamento Automático**: Todos os dados são salvos automaticamente
- **Armazenamento Local**: Dados persistem entre sessões do app
- **Backup Seguro**: Seus progressos nunca são perdidos
- **Configurações**: Gerencie e limpe dados quando necessário

## 🚀 Como Usar

### 1. Adicionar Exercícios
- Toque em "Exercícios"
- Clique em "Adicionar Exercício"
- Preencha nome, categoria e valores iniciais
- O exercício começará no nível 1

### 2. Criar Treinos
- Vá para "Treinos"
- Organize exercícios por dia da semana
- Defina séries, repetições e tempo de descanso

### 3. Treinar e Ganhar XP
- Toque em um treino para iniciar
- Registre peso e repetições para cada set
- Complete o treino para ganhar XP
- Acompanhe seu progresso

### 4. Acompanhar Estatísticas
- Visualize "Estatísticas"
- Veja XP total e nível geral
- Acompanhe conquistas desbloqueadas
- Monitore sua sequência de treinos
- Revise histórico de sessões recentes

### 5. Configurações e Dados
- Toque no ícone ⚙️ no header
- Visualize status do armazenamento
- Limpe todos os dados se necessário
- Informações sobre o app

## 🎮 Sistema de XP

### Fórmula de XP
```
XP = Base + (Peso × Multiplicador) + (Reps × Multiplicador) + (Nível × Bônus) + (Streak × Bônus)
```

### Níveis e Progressão
- **Nível 1**: 0-100 XP
- **Nível 2**: 100-250 XP  
- **Nível 3**: 250-475 XP
- **Nível 4**: 475-812 XP
- E assim por diante...

### Bônus e Multiplicadores
- **Peso**: 0.1 XP por kg
- **Repetições**: 0.5 XP por rep
- **Nível**: 0.1 XP por nível atual
- **Streak**: 0.2 XP por dia consecutivo

## 🏆 Conquistas

- **Iniciante**: 1.000 XP
- **Dedicado**: 5.000 XP
- **Consistente**: 10.000 XP
- **Determinado**: 25.000 XP
- **Viciado**: 50.000 XP
- **Lendário**: 100.000 XP

## 🛠️ Tecnologias

- **React Native** com Expo
- **TypeScript** para tipagem
- **Context API** para gerenciamento de estado
- **AsyncStorage** para persistência de dados
- **Sistema de XP** customizado
- **Design responsivo** e moderno

## 📱 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/React-Native-App-Academy.git
cd React-Native-App-Academy
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o aplicativo:
```bash
npm start
```

4. Use o Expo Go no seu dispositivo ou emulador

## 🎨 Design System

### Cores
- **Primária**: #3B82F6 (Azul moderno)
- **Secundária**: #8B5CF6 (Roxo elegante)
- **Accent**: #10B981 (Verde sucesso)
- **Fundo**: #0A0A0A (Preto puro)
- **Superfície**: #1A1A1A (Cinza escuro)

### Componentes
- Cards com sombras profundas e bordas arredondadas
- Barras de progresso para XP
- Badges de nível elegantes
- Botões com estados visuais modernos
- Modais responsivos e elegantes
- Tipografia hierárquica e legível

### Características do Design
- **Minimalista**: Interface limpa e focada
- **Moderno**: Visual contemporâneo e profissional
- **Elegante**: Cores suaves e espaçamento generoso
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Acessível**: Contraste adequado e hierarquia visual clara

## 💾 Sistema de Persistência

### Funcionalidades
- **Salvamento Automático**: Dados são salvos após cada alteração
- **Carregamento Inteligente**: App carrega dados salvos ao iniciar
- **Tratamento de Erros**: Sistema robusto para falhas de armazenamento
- **Conversão de Tipos**: Datas e objetos complexos são tratados corretamente

### Dados Salvos
- ✅ Exercícios cadastrados
- ✅ Treinos criados
- ✅ Sessões completadas
- ✅ Estatísticas e XP
- ✅ Progresso de leveling
- ✅ Conquistas desbloqueadas

### Segurança
- **Armazenamento Local**: Dados ficam apenas no seu dispositivo
- **Backup Automático**: Sempre há uma cópia atualizada
- **Recuperação**: Dados são restaurados automaticamente

## 🔮 Próximas Funcionalidades

- [ ] Sincronização com nuvem
- [ ] Gráficos de progresso interativos
- [ ] Notificações de treino
- [ ] Compartilhamento de treinos
- [ ] Modo offline
- [ ] Backup automático
- [ ] Integração com wearables
- [ ] Temas personalizáveis
- [ ] Animações fluidas
- [ ] Exportação de dados
- [ ] Múltiplos usuários

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir novas funcionalidades
3. Enviar pull requests
4. Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- Inspirado no conceito de "Gamificação das atividades"
- Comunidade React Native
- Expo team
- Todos os contribuidores

---

**Transforme seus treinos em progresso com design moderno e elegante! 🚀💪**
