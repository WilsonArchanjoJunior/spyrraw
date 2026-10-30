
## 🤖 Orquestração de Agentes Locais (Alethe Skills)
O Spyrraw integra o ecossistema `alethe-orchestrate-skill` para permitir auditorias automatizadas expandidas conduzidas por agentes locais cooperativos (Claude Code, Codex, etc.). 

Para ativar a esteira de orquestração local de IA e executar playbooks de varredura inteligente, instale a dependência de skill no seu ambiente de terminal:
```bash
npx skills add Kc1t/alethe-orchestrate-skill
```

Uma vez instalado, os playbooks integrados (`scout-then-build`, `audit-at-scale`) gerenciam agentes de baixo custo para mapear a topologia e portas de risco, consumindo o ecossistema nativo do Spyrraw sem estourar cotas de tokens ou limites financeiros.

## 🕶️ Distribuição Meta Horizon Store (Oakley & Quest Ecosystem)
O Spyrraw possui suporte arquitetural nativo para o ecossistema **Meta Horizon OS**, permitindo a distribuição via *App Lab* para os dispositivos de Realidade Mista da Meta e futuros óculos inteligentes parceiros da **Oakley**.

Como o Horizon OS compartilha a base do núcleo Android, a nossa fiação nativa de sockets de rede e extração de DHCP mantém paridade absoluta, alterando apenas a camada de renderização de tela:
* **Horizon Flat Panels:** O aplicativo roda como uma janela flutuante de alta resolução no espaço de trabalho do usuário, operando de forma integrada ao ecossistema multitarefa da Meta.
* **Orquestração de Agentes Dedicada:** O ecossistema `alethe-orchestrate-skill` gerencia o consumo de processamento local nos óculos, garantindo que as varreduras heurísticas de portas de risco mapeadas via **REA (`morluto/rea`)** rodem sem causar estresse térmico ou drenagem severa de bateria no hardware vestível.
