import { Injectable, Dependencies } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const DEFAULT_CONFIG = {
  nombreComercial: 'MANNÀ',
  razonSocial: 'Alimentos Naturales S.A.S.',
  holding: 'GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.',
  nit: '901.234.567-8',
  ciudad: 'Santa Marta, Magdalena - Colombia',
  telefono: '+57 300 123 4567',
  correo: 'hola@manna.com.co',
  web: 'www.manna.com.co',
  instagram: '@manna.alimentos',
  qrUrl: 'https://manna.com.co',
  lemaCabecera: 'Semilla · Tiempo · Fruto',
  citaEditorial: 'Sabor que nace de lo natural. Tradición que mira al futuro.',
  fraseProposito: 'Gracias por ser parte de este propósito.',
  piePagina: 'SABOR QUE NACE DE LO NATURAL'
};

@Injectable()
@Dependencies(PrismaService)
export class CompanyConfigRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getConfig() {
    let config = await this.prisma.configuracionEmpresa.findFirst();
    if (!config) {
      config = await this.prisma.configuracionEmpresa.create({
        data: DEFAULT_CONFIG
      });
    }
    return config;
  }

  async updateConfig(data) {
    const existing = await this.prisma.configuracionEmpresa.findFirst();
    const { id, actualizadoEn, ...cleanData } = data;
    if (existing) {
      return this.prisma.configuracionEmpresa.update({
        where: { id: existing.id },
        data: cleanData
      });
    }
    return this.prisma.configuracionEmpresa.create({
      data: { ...DEFAULT_CONFIG, ...cleanData }
    });
  }
}
