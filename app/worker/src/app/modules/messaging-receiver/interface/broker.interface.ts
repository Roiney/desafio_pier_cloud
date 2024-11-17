export interface BrokerMessage {
  id: string; // ID único da mensagem
  data: {
    id: string; // ID do vendedor
    name: string; // Nome do vendedor
    phone: string; // Telefone do vendedor
  };
}
