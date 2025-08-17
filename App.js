import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getQuote } from './src/services/apiService.js';
import { isWorkingDay } from './src/services/dateService.js';


function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const receivedToken = await login(username, password);
      onLoginSuccess(receivedToken);
    } catch (error) {
      Alert.alert("Erro de Login", error.message);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Autenticação</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
        editable={!isLoading}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Entrar" onPress={handleSubmit} />
      )}
    </View>
  );
}


function QuoteDashboard({ onLogout }) {
  const [cotacao, setCotacao] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const buscarCotacao = useCallback(async () => {
    setCarregando(true);
    try {
      const data = await getQuote();
      if (data.value && data.value.length > 0) {
        setCotacao(data.value[0]);
        setErro(null);
      } else {
        setCotacao(null); 
        setErro("Cotação não disponível no momento.");
      }
    } catch (error) {
      setErro(error.message);
      if (error.message.includes('401')) {
        onLogout();
      }
    } finally {
      setCarregando(false);
    }
  }, [onLogout]);

  useEffect(() => {
    const startQuoteService = async () => {
      const todayIsWorkingDay = await isWorkingDay();
      if (todayIsWorkingDay) {
        buscarCotacao();
        const intervalId = setInterval(buscarCotacao, 5000);
        return () => clearInterval(intervalId);
      } else {
        setErro("Não há cotação para hoje (fim de semana ou feriado).");
        setCarregando(false);
      }
    };
    startQuoteService();
  }, [buscarCotacao]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cotação do Dólar</Text>
      
      {carregando && <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />}
      
      {erro && <Text style={styles.errorText}>{erro}</Text>}

      {cotacao && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteLabel}>Compra: <Text style={styles.quoteValue}>R$ {cotacao.cotacaoCompra}</Text></Text>
          <Text style={styles.quoteLabel}>Venda: <Text style={styles.quoteValue}>R$ {cotacao.cotacaoVenda}</Text></Text>
          <Text style={styles.updateText}>Atualizado em: {new Date(cotacao.dataHoraCotacao).toLocaleString('pt-BR')}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Atualizar" onPress={buscarCotacao} disabled={carregando} />
        <Button title="Sair" onPress={onLogout} color="#dc3545" />
      </View>
    </View>
  );
}


export default function App() {
  const [token, setToken] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
      setIsAppLoading(false);
    };
    checkToken();
  }, []);

  const handleLoginSuccess = async (receivedToken) => {
    await AsyncStorage.setItem('authToken', receivedToken);
    setToken(receivedToken);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setToken(null);
  };

  
  if (isAppLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!token ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <QuoteDashboard onLogout={handleLogout} />
      )}
    </View>
  );
}

// --- Folha de Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  quoteContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  quoteLabel: {
    fontSize: 20,
    color: '#333',
  },
  quoteValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  updateText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 15,
  },
  errorText: {
    color: '#dc3545',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
