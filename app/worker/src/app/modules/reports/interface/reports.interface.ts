export interface FormattedSaleData {
  vendedor_id: number | null;
  vendedor_nome: string | null;
  vendedor_telefone: string | null;
  cliente_id: number | null;
  cliente_nome: string | null;
  cliente_telefone: string | null;
  cliente_email: string | null;
  produto_id: number | null;
  produto_nome: string | null;
  produto_preco: any | null; // Pode ajustar para um tipo mais específico, como `number` ou `Decimal`, se aplicável
  produto_sku: string | null;
}
