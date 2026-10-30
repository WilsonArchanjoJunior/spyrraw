export const theme = {
  colors: {
    background: '#070F0E',       // Preto profundo tático (economiza bateria e dá transparência no XR)
    surface: '#111F1D',          // Verde-carapaça escuro para os cartões de status
    primary: '#10B981',          // Verde Alerta/Ok (Conexão Segura)
    warning: '#F59E0B',          // Amarelo Heurístico (Porta suspeita aberta)
    danger: '#EF4444',           // Vermelho Alerta Máximo (Risco crítico / POS vulnerável)
    text: '#E0F2FE',             // Branco azulado de alta luminescência para leitura em lentes AR
    textMuted: '#64748B',        // Cinza tático para detalhes secundários
    border: '#1E3A37'            // Bordas esmeralda escuras para delimitar os painéis no espaço
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    card: 16,                    // Cantos arredondados orgânicos para janelas flutuantes
    button: 12
  },
  typography: {
    // Tamanhos otimizados para manter a legibilidade a 1.5 metros de distância virtual
    size: {
      small: 14,
      body: 18,
      title: 26,
      display: 34
    },
    weight: {
      regular: '400',
      medium: '600',
      bold: '700'
    }
  }
};
