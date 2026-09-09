# Confirmação de presença — Aliston Matheus & Ana Laura

Site estático (HTML/CSS/JS puro) para confirmação de presença do casamento, com respostas salvas no Firebase Firestore. Sem backend próprio, sem login.

## Arquivos

- `index.html` — estrutura da página (convite + formulário)
- `style.css` — visual (creme, dourado, flores, tipografia romântica)
- `script.js` — lógica do formulário e integração com o Firestore

## 1. Criar o projeto Firebase

1. Acesse https://console.firebase.google.com e crie um projeto novo (gratuito).
2. Em **Compilação → Firestore Database**, clique em **Criar banco de dados** e escolha o modo **produção** (ajustaremos as regras abaixo).
3. Em **Configurações do projeto → Seus apps**, clique no ícone `</>` para registrar um app da Web. Copie o objeto `firebaseConfig` gerado.
4. Cole esses valores no topo do arquivo `script.js`, substituindo os campos `"SUA_API_KEY"`, `"SEU_PROJETO"`, etc.

## 2. Regras do Firestore

Como não há login, as regras precisam permitir escrita pública apenas na coleção de confirmações. Em **Firestore Database → Regras**, use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /confirmacoes/{docId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

Isso permite que qualquer visitante **crie** uma confirmação, mas ninguém consiga ler, editar ou apagar as respostas pelo site (só você, pelo Console do Firebase).

## 3. Ver as respostas

As confirmações aparecem em **Firestore Database → Dados → confirmacoes**, cada uma com:
- `nome` — nome do convidado principal
- `acompanhantes` — lista com os nomes adicionados
- `totalPessoas` — total de pessoas daquela confirmação
- `criadoEm` — data/hora do envio

Para exportar tudo em uma planilha, use o menu **⋮ → Exportar coleção** no Console, ou copie manualmente.

## 4. Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público) e envie estes três arquivos (`index.html`, `style.css`, `script.js`) para a raiz dele.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`. Salve.
4. Em alguns minutos o site estará no ar em `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`.

## 5. Depois do casamento

Basta apagar o repositório do GitHub e, se quiser, o projeto no Firebase — nenhuma outra limpeza é necessária.

---

### Personalização rápida
- Textos e informações do casamento: editar diretamente em `index.html`.
- Cores e fontes: variáveis no topo de `style.css` (`:root { ... }`).
- Nome da coleção no Firestore: constante `COLLECTION_NAME` em `script.js`.
