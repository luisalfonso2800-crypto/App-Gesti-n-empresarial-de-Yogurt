import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocurrió un error inesperado al procesar la solicitud.';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const rawTarget = Array.isArray(exception.meta?.target)
            ? exception.meta.target.join(' ')
            : String(exception.meta?.target || '');
          
          const targetLower = rawTarget.toLowerCase();
          let campoLegible = 'documento o dato de identificación';

          if (targetLower.includes('nit') || targetLower.includes('cedula') || targetLower.includes('documento')) {
            campoLegible = 'NIT / Cédula';
          } else if (targetLower.includes('razon') || targetLower.includes('nombre')) {
            campoLegible = 'Nombre / Razón Social';
          } else if (targetLower.includes('email') || targetLower.includes('correo')) {
            campoLegible = 'Correo Electrónico';
          } else if (targetLower.includes('telefono') || targetLower.includes('celular')) {
            campoLegible = 'Teléfono / Celular';
          } else if (rawTarget) {
            campoLegible = rawTarget;
          }

          status = HttpStatus.CONFLICT;
          message = `Ya existe un proveedor registrado con este ${campoLegible}. Por favor verifique el valor ingresado.`;
          break;
        }
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'El registro solicitado no fue encontrado o ya fue eliminado.';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'No se puede completar la acción porque este registro está vinculado con otros datos del sistema.';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Error en base de datos (${exception.code}): ${exception.message.split('\n').pop()}`;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' && res.message
        ? (Array.isArray(res.message) ? res.message.join('. ') : res.message)
        : (res || exception.message);
    } else if (exception.message) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
