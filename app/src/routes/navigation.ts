export type RootStackParamList = {
  InfosPessoais: undefined;
  Login: undefined;
  guiaDoUsuario: undefined;
  Verificacao2FA: { email: string; ativar?: boolean };
  Gerenciar2FA: { email: string; isEnabled: boolean };
};