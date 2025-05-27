import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { createStyles } from './styles';
import { Searchbar } from 'react-native-paper';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItemType {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItemType[] = [
  {
    id: '1',
    question: 'Como faço para criar um novo registro de gasto?',
    answer: `Para criar um novo registro, toque no botão azul com o ícone de "+", localizado no centro do menu de navegação inferior. Você será direcionado para a tela de Novo Registro.

Siga os passos abaixo:

- Selecione o projeto ao qual o registro pertence.
- Escolha o pacote de gastos e a categoria.
- Insira a data de quando o gasto foi realizado.
- Insira o valor do gasto e adicione uma imagem do comprovante.

Na parte inferior da tela, você poderá visualizar o quanto já foi consumido do orçamento disponível para esse projeto.`,
  },
  {
    id: '2',
    question: 'Onde vejo os projetos que estou participando?',
    answer: `Na página inicial (Home), você verá uma lista com todos os projetos dos quais participa. Ao tocar em um projeto, será exibido um histórico detalhado de gastos, organizados por pacotes dentro daquele projeto.`,
  },
  {
  id: '3',
  question: 'Como faço para solicitar um reembolso?',
  answer: `Acesse a página inicial e toque no projeto desejado.

- Selecione o pacote relacionado ao gasto que deseja solicitar reembolso.
- Visualize os detalhes do gasto e toque no botão "Solicitar reembolso".

⚠️ Importante: Para que a solicitação seja aceita, ela deve estar dentro do limite de orçamento previamente definido e será necessário aguardar a confirmação do seu superior. O status da solicitação ficará visível dentro do pacote correspondente.`
},
{
  id: '4',
  question: 'Como posso visualizar meu histórico de gastos?',
  answer: `No menu de navegação inferior, toque na aba Histórico. Nessa tela você poderá:

- Ver todos os registros de gastos por categoria.
- Acompanhar o total de gastos.
- Consultar os reembolsos aprovados, negados e pendentes.`
},
{
  id: '5',
  question: 'O que encontro na tela de Perfil?',
  answer: `A tela de Perfil mostra:

- Sua foto de usuário.
- A lista de projetos em que está inserido.
- A quantidade de solicitações de reembolso pendentes.`
},
{
  id: '6',
  question: 'Como posso alterar meus dados pessoais?',
  answer: `Dentro da tela de Perfil, toque na opção Informações Pessoais. Lá, você pode editar:

- Sua foto de perfil
- Seu nome
- Seu e-mail`
},
{
  id: '7',
  question: 'Consigo editar um registro depois de criado?',
  answer: `Não. Por questões de segurança e integridade dos dados, não é possível editar um registro de gasto após ele ter sido criado.

Se houver alguma informação incorreta, recomenda-se entrar em contato com o seu superior ou responsável pelo projeto para orientação sobre como proceder.`
},
{
  id: '9',
  question: 'Recebo alguma notificação quando meu reembolso é aprovado?',
  answer: `Sim. Assim que seu reembolso for aprovado, você receberá uma notificação no app e poderá ver o status atualizado dentro do pacote do projeto e também na aba Histórico.`
},
{
  id: '10',
  question: 'É possível excluir um registro de gasto?',
  answer: `Por padrão, não é possível excluir registros de gastos após serem salvos, para manter a integridade das informações do projeto. Caso precise corrigir algo, utilize a opção de edição do registro ou entre em contato com seu gestor.`
},
{
  id: '11',
  question: 'O que é um pacote de gastos?',
  answer: `Um pacote de gastos é uma subdivisão dentro de cada projeto, que organiza os recursos disponíveis por tipo de despesa, período ou finalidade. Isso ajuda a manter o controle do orçamento e facilitar a aprovação de reembolsos.`
},
{
  id: '12',
  question: 'Meu projeto não aparece na tela inicial. O que faço?',
  answer: `Verifique com seu superior se o projeto já foi atribuído à sua conta. Se o problema persistir, tente reiniciar o app ou verificar sua conexão com a internet. Caso continue sem acesso, entre em contato com o suporte da equipe.`
},
{
  id: '13',
  question: 'Preciso estar conectado à internet para usar o app?',
  answer: `Sim. O aplicativo precisa de conexão com a internet para sincronizar dados, enviar registros de gastos, solicitar reembolsos e atualizar as informações dos projetos em tempo real.`
},
{
  id: '14',
  question: 'Como sei se estou dentro do limite de orçamento?',
  answer: `Você pode acompanhar o consumo do orçamento de duas formas:

- Na tela inicial, cada projeto é exibido em um card com um indicador em tempo real de quanto já foi consumido do orçamento total disponível.
- Durante a criação de um novo registro, a parte inferior da tela também mostra o quanto já foi utilizado do orçamento do pacote específico dentro do projeto selecionado.

Essas informações ajudam você a manter seus gastos dentro dos limites estabelecidos.`
},
{
  id: '15',
  question: 'Posso participar de mais de um projeto ao mesmo tempo?',
  answer: `Sim. É possível participar de vários projetos ao mesmo tempo. Todos os projetos vinculados à sua conta serão exibidos na página inicial, e você pode alternar entre eles livremente.`
},
{
  id: '16',
  question: 'Meu reembolso foi aprovado, mas ainda não recebi. O que devo fazer?',
  answer: `O app confirma a aprovação da solicitação, mas o pagamento depende dos processos internos da sua empresa. Caso haja demora, entre em contato com o setor financeiro ou com seu superior responsável.`
},
{
  id: '19',
  question: 'Quem aprova meus reembolsos?',
  answer: `A aprovação dos reembolsos é feita pelo superior ou gestor responsável pelo projeto. O status da sua solicitação será atualizado dentro do pacote do projeto após a análise.`
},
{
  id: '20',
  question: 'Posso cancelar uma solicitação de reembolso?',
  answer: `Não. Após o envio, a solicitação fica registrada para análise. Caso tenha enviado um pedido incorreto, entre em contato com seu gestor para que ele possa tomar as providências adequadas.`
},
{
  id: '22',
  question: 'O que significa cada status de reembolso?',
  answer: `- Aguardando aprovação: Aguardando análise do gestor.
- Aprovado: Será processado para pagamento.
- Negado: Não aprovado (verifique o motivo com seu gestor).
- Rascunho: A solicitação de reembolso ainda não foi feita.
- Aprovado Parcialmente: O reembolso foi analisado e aprovado com ressalvas, entre em contato com seu gestor para mais informações.`
},
{
  id: '23',
  question: 'Como adiciono uma imagem do comprovante?',
  answer: `Durante a criação de um novo registro, você pode tocar no botão de adicionar imagem e escolher entre tirar uma foto com a câmera ou selecionar uma imagem da galeria do seu celular.`
},
{
  id: '24',
  question: 'Preciso anexar um comprovante para todos os registros?',
  answer: `Sim. O comprovante é obrigatório para que os registros sejam validados e possam ser considerados em uma solicitação de reembolso.`
},
{
  id: '25',
  question: 'O que fazer se o app travar ou apresentar erro?',
  answer: `Reinicie o aplicativo e verifique sua conexão com a internet. Se o problema persistir, entre em contato com o suporte técnico da sua empresa ou com a equipe responsável pela manutenção do sistema.`
},
{
  id: '26',
  question: 'O que fazer se eu escolher o projeto ou pacote errado ao criar um registro?',
  answer: `Como não é possível editar registros após a criação, será necessário entrar em contato com seu superior ou com o suporte do sistema para reportar o erro e receber orientações.`
},
{
  id: '27',
  question: 'Posso usar o app em mais de um dispositivo?',
  answer: `Sim, desde que você use as mesmas credenciais de acesso. No entanto, o uso simultâneo pode causar inconsistências nos dados, então o ideal é utilizar um dispositivo por vez.`
},
{
  id: '28',
  question: 'Como recebo notificações do app?',
  answer: `Você receberá notificações importantes (como aprovações ou negações de reembolso) dentro do app. Certifique-se de que as notificações estão habilitadas nas configurações do seu celular para não perder nenhuma atualização.`
},
{
  id: '30',
  question: 'Como entrar em contato com o suporte?',
  answer: `Na tela de Perfil ou no menu lateral (caso exista), você encontrará a opção “Ajuda” ou “Suporte”, com as instruções de contato com a equipe responsável, seja por e-mail, telefone ou chat.`
}
];

const FAQScreen = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaq = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return faqData.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const FAQHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: theme.colors.primary }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>📘 Dúvidas Frequentes (FAQ)</Text>
    </View>
  );

  const FAQItem = ({ item }: { item: FAQItemType }) => {
    const isOpen = openId === item.id;

    return (
      <View style={[styles.accordionItem, { backgroundColor: theme.colors.secondary }]}>
        <TouchableOpacity
          style={styles.accordionButton}
          onPress={() => handleToggle(item.id)}
        >
          <Text style={[styles.question, { color: theme.colors.text }]}>
            {item.question}
          </Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.answerContainer}>
            <Text style={[styles.answerText, { color: theme.colors.text }]}>
              {item.answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FAQHeader />
      <Searchbar
        placeholder="Buscar dúvidas..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.search, { margin: 20, backgroundColor: theme.colors.cinza_medio_claro }]}
        placeholderTextColor={theme.colors.text}
        iconColor={theme.colors.text}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredFaq.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQScreen;
