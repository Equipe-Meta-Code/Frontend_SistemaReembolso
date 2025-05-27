export type RootStackParamList = {
  InfosPessoais: undefined;
  Login: undefined;
  guiaDoUsuario: undefined;
  Verificacao2FA: { email: string; ativar?: boolean; userId: Number };
  Gerenciar2FA: { email: string; isEnabled: boolean };
};