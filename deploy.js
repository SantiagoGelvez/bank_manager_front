import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

async function deploy() {
    try {
        console.log('Actualizando repositorio desde GitHub...');
        await execPromise('git pull origin main');

        console.log('Instalando dependencias...');
        await execPromise('npm install');

        console.log('Compilando el proyecto...');
        await execPromise('npm run build');

        console.log('Reiniciando aplicaciones con PM2...');
        await execPromise('pm2 restart all');

        console.log('Despliegue completado con éxito.');
    } catch (error) {
        console.error('Error en el despliegue:', error);
    }
}

deploy();