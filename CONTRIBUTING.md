# Guia de Contribuição

Obrigado por considerar contribuir com o LBOT v2.0! 🎉

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/seu-usuario/whatsapp-bot-baileys/issues)
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Node.js e sistema operacional

### Sugerindo Funcionalidades

1. Abra uma issue com a tag `enhancement`
2. Descreva detalhadamente a funcionalidade
3. Explique por que seria útil
4. Proponha uma implementação (opcional)

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork
3. Crie uma **branch** para sua funcionalidade:
   ```bash
   git checkout -b feature/MinhaNovaFuncionalidade
   ```
4. Faça suas alterações seguindo o [Padrão de Código](#padrão-de-código)
5. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
6. **Push** para sua branch:
   ```bash
   git push origin feature/MinhaNovaFuncionalidade
   ```
7. Abra um **Pull Request**

## Padrão de Código

### Estrutura de Comandos

Todos os comandos devem seguir este padrão:

```javascript
export default {
  name: 'nomecomando',
  aliases: ['alias1', 'alias2'],
  category: 'categoria',
  description: 'Descrição do comando',
  adminOnly: false, // se apenas admins podem usar
  groupOnly: false, // se funciona apenas em grupos
  
  async execute(sock, message, args, { isGroup, sender, from }) {
    // Implementação
  }
};
```

### Convenções

- Use **ES6+** (import/export, async/await, arrow functions)
- **Nomes descritivos** para variáveis e funções
- **Comentários** em português para lógica complexa
- **Error handling** com try/catch
- **Logs** usando a classe Logger

### Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

Exemplos:
```
feat: adiciona comando de enquete
fix: corrige erro no download do YouTube
docs: atualiza README com novas instruções
```

## Adicionando Novos Comandos

1. Crie o arquivo na pasta apropriada em `src/commands/`
2. Siga o padrão de estrutura
3. Importe e registre no `handler.js`
4. Adicione documentação no README
5. Teste em grupo e privado

## Adicionando Novos Serviços

1. Crie o arquivo em `src/services/`
2. Use classes ou objetos singleton
3. Adicione tratamento de erros
4. Documente métodos principais

## Testando

Antes de submeter um PR:

- ✅ Teste o comando em grupo
- ✅ Teste o comando em privado
- ✅ Teste com permissões de admin
- ✅ Teste com usuário comum
- ✅ Verifique logs de erro
- ✅ Limpe código comentado
- ✅ Remova console.logs de debug

## Dúvidas?

Abra uma issue com a tag `question` ou entre em contato!

---

**Obrigado por contribuir! 🚀**
