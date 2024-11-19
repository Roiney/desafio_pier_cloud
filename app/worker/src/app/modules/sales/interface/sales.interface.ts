export interface Sale {
  vendedor_id: string; // ID do vendedor associado
  produto_id: string; // ID do produto associado
  cliente_id: string; // ID do cliente associado
  id: string; // ID único da resposta
}

export interface SaleWithRelations {
  id: number;
  vendedor_id: number | null;
  produto_id: number | null;
  cliente_id: number | null;
  createdAt: Date;
  updatedAt: Date;
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  produto: {
    id: number;
    nome: string;
    tipo: string;
    preco: any; // Decimal pode ser tratado como string ou number dependendo da necessidade
    sku: string;
    vendedor_id: number | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  vendedor: {
    id: number;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}
