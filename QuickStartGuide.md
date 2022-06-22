# Quick Start

Este documento sirve como guía para los pasos necesarios para ejecutar una prueba que:
- Genere claves
- Genere elecciones
- Cargue elecciones al sistema appEv
- Pruebe el sistema de resincronización
- Pruebe votación en grandes cantidades
- Pruebe queries en grandes cantidades

Las pruebas de load testing se corrieron sin las siguientes configuraciones, ya que correr todos los subsistemas en paralelo en una sola máquina al mismo tiempo puede requerir más poder de computo del disponible.

## Pasos
### 0) Requerimientos:
- Los indicados en la guia de comandos 
  - Redis en docker
  - MongoDB en docker
  - ts-node instalado globalmente
  - pm2 instalado globalmente
  - typescript instalado en pm2
- Se puede ver la consola de pm2 con:
    ```
    pm2 monit
    ```
- Una vez se tenga levantada la base de datos mySQL siguiendo la guía de CommandGuide.md, se debe ejecutar `npm run commandConsumer` hasta que diga Consumer started y luego cancelarlo para sincronizar los modelos.
- Se debe ejecutar los siguientes comandos en cada instancia de mysql haciendo uso de MySQLWorkbench para que se pueda tener multiples conexiones simultaneas.
    ```sql
    set global max_connections = 15000;
    show variables like "max_connections";
    ```




### 1) Instalar dependencias
```
npm run install:all
```

### 2) Levantar consumidores
Levanta 3 consumidores de comandos y 6 de queries.
```
npm run pm2:consumers
```

### 3) Generar claves del servidor
```
npm run serverKeyGenerator
```

### 4) Generar claves de votantes
Puede configurarse la cantidad en ./Utilities/APIAutoridadElectoral/KeyGenerator/config

**Una instancia**
```
npm run voterKeyGenerator
```

**Multiples instancias con pm2**
```
npm run voterKeyGeneratorPM2 
```

Cuando se vea que termino de procesar en pm2 monitor:
```
pm2 delete generateVoterKeys
npm run mergeVoterKeys
```

### 5) Generar elecciones y votantes
Se pasa por prompts de la consola las cantidades deseadas, no puede haber mas votantes que cantidad de claves generadas.

```
npm run electionGenerator
```

Una vez se muestre `Finished saving voters in mongoose` se puede detener con `CTRL + C`.


### 6) Levantar todos los sistemas
Pueden levantarse individualmente siguiendo los comandos del archivo [CommandGuide.md](./CommandGuide.md) o ejecutando el comando:

```
npm run pm2:all
```

Va a aparecer en la consola de pm2 de electionSubSystem el progreso de agregar las elecciones, hasta que no se indique que el inicio y fin de la última elección fue "scheduled", no se van a haber terminado de agregar a los votantes ni elecciones.