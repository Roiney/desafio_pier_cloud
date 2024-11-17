import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 20000, // Timeout global para todas as requisições HTTP
    }),
  ],
  exports: [HttpModule],
})
export class GlobalHttpModule implements OnModuleInit {
  private readonly logger = new Logger(GlobalHttpModule.name);

  constructor(private readonly httpService: HttpService) {}

  onModuleInit(): void {
    // Adiciona um interceptor global à instância do Axios para requisições
    this.httpService.axiosRef.interceptors.request.use(
      (req) => {
        this.logger.log(`Interceptando requisição para: ${req.url}`);
        return req;
      },
      async (error) => {
        this.logger.error('Erro na configuração da requisição:', error.message);
        return await Promise.reject(error);
      },
    );

    // Adiciona um interceptor global à instância do Axios para respostas
    this.httpService.axiosRef.interceptors.response.use(
      (res) => {
        this.logger.log(`Resposta recebida de: ${res.config.url}`);
        return res;
      },
      async (error) => {
        this.logger.error('Erro na resposta da API:', error.message);
        return await Promise.reject(error);
      },
    );
  }
}
