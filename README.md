# 📱 App de Cotação de Moedas (React Native)

Aplicativo móvel nativo (Android) desenvolvido com **React Native** e **Expo** como parte de um desafio técnico para vaga de desenvolvedor júnior.  
O app consome a mesma **API backend em .NET** desenvolvida para este projeto, compartilhando a mesma lógica de negócio da aplicação web, mas entregando uma experiência totalmente nativa.

---

## ✨ Funcionalidades

- **Fluxo de Autenticação JWT**  
  Tela de login nativa para obter um token JWT do backend.

- **Gerenciamento de Sessão Nativo**  
  O token JWT é armazenado de forma persistente no dispositivo usando `@react-native-async-storage/async-storage`, mantendo o usuário logado mesmo após fechar o app.

- **Atualização Inteligente**  
  Auto-refresh a cada **5 segundos**, ativado apenas em dias úteis.  
  Verifica fins de semana e feriados nacionais via **BrasilAPI**, evitando chamadas desnecessárias.

- **Interface Nativa**  
  Construído com componentes nativos do React Native (`<View>`, `<Text>`, `<TextInput>`, `<Button>`), garantindo performance e aparência otimizadas.

- **Feedback de UX Nativo**  
  Utiliza componentes como `<ActivityIndicator>` e `<Alert>` para fornecer feedback de carregamento e erros, criando uma experiência de usuário fluida.

---

## 🚀 Tecnologias Utilizadas

- **React Native**
- **Expo** (ambiente de desenvolvimento e build)
- **JavaScript (ES6+)**
- **Hooks do React**: `useState`, `useEffect`, `useCallback`
- **fetch API** para comunicação com o backend
- **Expo Application Services (EAS)** para build em nuvem

---

## 📲 Como Testar o Aplicativo (Android)

O aplicativo foi construído e está disponível para instalação direta através do **Expo Application Services (EAS)**.

### 1. Acesse o link do build:
👉 **[https://expo.dev/artifacts/eas/oebKhKkDoUQX3ayp5LaBco.aab]

### 2. Instale o aplicativo:
- Use a câmera do seu celular Android para escanear o **QR Code** que aparece na página do link.  
- O celular irá baixar o arquivo de instalação (`.apk`).  
- Abra o arquivo baixado e siga as instruções para instalar.  
  > ⚠️ Pode ser necessário permitir a **instalação de apps de fontes desconhecidas** nas configurações de segurança do Android.

### 3. Teste a aplicação:
- Abra o novo aplicativo **"CotacaoApp"** instalado.  
- Use as credenciais:  
  - **Usuário:** `admin`  
  - **Senha:** `12345`  

---
