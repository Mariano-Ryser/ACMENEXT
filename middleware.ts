import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};




// Aquí estás inicializando NextAuth.js con el authConfigobjeto
//  y exportando la authpropiedad. También estás usando la matcheropción
//   de Middleware para especificar que debe ejecutarse en rutas específicas.
// La ventaja de emplear Middleware para esta tarea es que las rutas
//  protegidas ni siquiera comenzarán a procesarse hasta que el Middleware
//   verifique la autenticación, lo que mejora tanto la seguridad como el
//    rendimiento de su aplicación.