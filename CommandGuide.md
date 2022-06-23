# Script Guide <!-- omit in toc -->

El siguiente documento es una guía de ejecución del sistema, en la cual se explica los scripts y su uso asociado.

Previo a poder probar los sistemas, se debe tener en docker

- Tener una instancia de Redis corriendo en el puerto 6379
- Tener una instancia de Mongo corriendo en el puerto 27017
- Seguir los pasos para instalar MySQL en base de datos distribuida en docker

Además, se asume que se tiene instalado globalmente los paquetes de node:

- ts-node : Para correr los proyectos de typescript
- pm2: Para correr multiples instancias de los subsistemas
  - Además se espera tener instalado con `pm2 install typescript` la capacidad de correr archivos .ts con pm2

Se debe tomar en cuenta que la mayoría de las herramientas y subsistemas contienen configuraciones dentro de su directorio en una carpeta config con un archivo development.json. Se deja por defecto localhost para las ips y los puertos comúnes de redis y mongo.

---

## Índice <!-- omit in toc -->

- [Resumen](#resumen)
  - [Generadores](#generadores)
  - [ElectoralAPI y Simuladores](#electoralapi-y-simuladores)
  - [Subsistemas](#subsistemas)
  - [Subsistemas pm2](#subsistemas-pm2)
- [Instalación](#instalación)
  - [Dependencias de Node para todos los subsistemas](#dependencias-de-node-para-todos-los-subsistemas)
  - [Instalación de base de datos MySQL](#instalación-de-base-de-datos-mysql)
- [Generadores de datos de prueba](#generadores-de-datos-de-prueba)
  - [Generación de pares de claves](#generación-de-pares-de-claves)
  - [Generación de Votantes y Elecciones](#generación-de-votantes-y-elecciones)
- [Autoridad Electoral](#autoridad-electoral)
- [Simulaciones de votos y queries](#simulaciones-de-votos-y-queries)
  - [Simulación de votos en grandes cantidades](#simulación-de-votos-en-grandes-cantidades)
  - [Simulación de queries en grandes cantidades](#simulación-de-queries-en-grandes-cantidades)
- [Subsistemas](#subsistemas-1)
  - [QueueConsumer](#queueconsumer)
    - [Instancias únicas](#instancias-únicas)
    - [Instancias multiples con PM2](#instancias-multiples-con-pm2)
  - [ElectionSubSystem (Sistema encargado de obtener elecciones y enviar actas)](#electionsubsystem-sistema-encargado-de-obtener-elecciones-y-enviar-actas)
  - [VotingSubSystem (Sistema que expone WebAPI encargada de recibir http request de votos)](#votingsubsystem-sistema-que-expone-webapi-encargada-de-recibir-http-request-de-votos)
  - [QuerySubSystem (Sistema que expone WebAPI para queries y configuración del sistema)](#querysubsystem-sistema-que-expone-webapi-para-queries-y-configuración-del-sistema)
  - [AuthSubSystem (Sistema FederatedIdentity que expone WebAPI y GRPC)](#authsubsystem-sistema-federatedidentity-que-expone-webapi-y-grpc)

---

## Resumen

<br/>

### Generadores

| Herramienta                     | Configuración/Requerimientos                                                                                                               | Comandos                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Instalación de Dependencias     | -                                                                                                                                          | `npm run install:all`                                                            |
| Base de datos MySQL distribuida | -                                                                                                                                          | <code> cd ./Utilities/MySQLDocker <br/> ./build.sh` </code>                      |
| Generar claves servidor         | <code> Largo de Clave <br> Path a configuración de server</code>                                                                           | `npm run serverKeyGenerator `                                                    |
| Generar claves votantes         | <code> Largo de Clave <br> Cantidad de claves</code>                                                                                       | `npm run voterKeyGenerator `                                                     |
| Generar claves votantes PM2     | <code> Largo de Clave <br> Cantidad de claves</code>                                                                                       | <code> npm run voterKeyGeneratorPM2 <br/> pm2 delete generateVoterKeys.js</code> |
| Generar votantes y elecciones   | <code> Se espera haber generado claves antes <br> Cantidad de claves de votantes >= Cantidad de votantes <br/> Conexión con MongoDB</code> | <code> npm run electionGenerator</code>                                          |

<br/>

---

<br/>

### ElectoralAPI y Simuladores

| Herramienta             | Configuración/Requerimientos                                                                                                                                                                                                                     | Comandos                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Autoridad Electoral     | <code> Conexión con Mongo <br> Puerto expuesto</code>                                                                                                                                                                                            | <code> npm run electoralAPI </code>                  |
| Autoridad Electoral PM2 | <code> Conexión con Mongo <br> Puerto expuesto</code>                                                                                                                                                                                            | <code> npm run electoralAPIPM2 -- {cantidad} </code> |
| Simulador de votos      | <code> Cantidad de votos <br> Offset de votos <br> Flag de fecha de envío</code>                                                                                                                                                                 | <code> npm run votingSimulation </code>              |
| Simulador de queries    | <code>Url y puerto de API <br> Cantidad de requests por endpoint <br> Offset de pagina de votante <br> Timeout de las requests y flag de test por duración <br> Routes a los que hacer requests <br> Routes Default para usar de ejemplo </code> | <code> npm run votingSimulation </code>              |

<br/>

---

<br/>

### Subsistemas

| Sistemas          | Configuración/Requerimientos                                                                                                                                  | Comandos                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| QueryConsumer     | <code> Conexión de Redis <br> Conexiones a MySQL</code>                                                                                                       | <code> npm run queryConsumer </code>     |
| CommandConsumer   | <code> Conexión de Redis <br> Conexiones a MySQL</code>                                                                                                       | <code> npm run commandConsumer </code>   |
| ElectionSubSystem | <code> Conexión de Redis <br> Puerto de electoralAPI <br/> Batchsize de votantes <br/> Get Election Frecuency </code>                                         | <code> npm run electionSubSystem </code> |
| VotingSubSystem   | <code> Conexión de Redis <br> Puerto expuesto por WebAPI <br/> Timeout de Req <br/> Tipo de Notificador <br/> Flag de testing <br/> Verbose flag</code>       | <code> npm run votingSubSystem </code>   |
| QuerySubSystem    | <code> Conexión de Redis <br> Conexión de MongoDB <br> Puerto expuesto por WebAPI <br/> Secreto de JWT <br/> Tipo de Notificador <br/> Flag de testing</code> | <code> npm run querySubSystem </code>    |
| AuthSubSystem     | <code> Conexión de Redis <br> Conexión de MongoDB <br> Puerto expuesto por WebAPI <br/> Secreto de JWT <br/> Tipo de Notificador <br/> Flag de testing</code> | <code> npm run authSubSystem </code>     |

<br/>

---

<br/>

### Subsistemas pm2

Para correr todos los sistemas en el modo predeterminado en vista de pm2 con 3 instancias para todo subsistema excepto electionSubSystem, authSubSystem y la electoralAPI.

```bash
npm run pm2:all
```

<br/>

| Sistemas                                                 | Configuración/Requerimientos                                                                                                                                  | Comandos                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| QueryConsumerPM2                                         | <code> Conexión de Redis <br> Conexiones a MySQL</code>                                                                                                       | <code> npm run queryConsumerPM2 -- {cantidad} </code>   |
| CommandConsumerPM2                                       | <code> Conexión de Redis <br> Conexión a MySQL</code>                                                                                                         | <code> npm run commandConsumer -- {cantidad} </code>    |
| ElectionSubSystemPM2 (Solo deberia usarse una instancia) | <code> Conexión de Redis <br> Puerto de electoralAPI <br/> Batchsize de votantes <br/> Get Election Frecuency </code>                                         | <code> npm run electionSubSystemPM2 </code>             |
| VotingSubSystemPM2                                       | <code> Conexión de Redis <br> Puerto expuesto por WebAPI <br/> Timeout de Req <br/> Tipo de Notificador <br/> Flag de testing <br/> Verbose flag</code>       | <code> npm run votingSubSystemPM2 -- {cantidad} </code> |
| QuerySubSystemPM2                                        | <code> Conexión de Redis <br> Conexión de MongoDB <br> Puerto expuesto por WebAPI <br/> Secreto de JWT <br/> Tipo de Notificador <br/> Flag de testing</code> | <code> npm run querySubSystemPM2 -- {cantidad} </code>  |
| AuthSubSystemPM2                                         | <code> Conexión de Redis <br> Conexión de MongoDB <br> Puerto expuesto por WebAPI <br/> Secreto de JWT <br/> Tipo de Notificador <br/> Flag de testing</code> | <code> npm run authSubSystemPM2 -- {cantidad} </code>   |

---

## Instalación

### Dependencias de Node para todos los subsistemas

Para instalar todas las dependencias se puede ejecutar el comando siguiente en la raíz del proyecto, que equivale a ejecutar en cada subsistema o directorio del proyecto que contenga un archivo `package.json` el comando `npm install`:

```bash
npm run install:all
```

### Instalación de base de datos MySQL

- Se debe tener una terminal que permite correr archivos .sh como gitbash
- Se debe tener corriendo docker
- Se debe haber asignado Read-Only a los archivos .cnf en el directorio /conf de master, slave1, slave2 y slave3 en el directorio ./Utilities/MySQLDocker. Esto se puede realizar en windows haciendo click derecho->propiedades y click en el checkbox de read-only.

```bash
cd ./Utilities/MySQLDocker
./build.sh
```

---

## Generadores de datos de prueba

### Generación de pares de claves

La generación de claves puede ser configurada en el archivo .json dentro de ./Utilities/APIAutoridadElectoral/KeyGenerator/config con las opciones:

- Largo de claves de votantes
- Largo de claves de servidor
- Cantidad de pares de llaves de votantes
- El path al config de votingSubSystem en el cual se guardan las claves del servidor

Previo a la ejecución del sistema, se debe crear claves para el servidor y para los votantes.
Para ello se debe ejecutar el comando siguiente en la raíz del proyecto:

**Generar claves del servidor**

```bash
npm run serverKeyGenerator
```

**Generar claves de votantes**

Se debe configurar la cantidad previamente, para acelerar el proceso se puede usar pm2 para correr varias instancias

Instancia sola:

```bash
npm run voterKeyGenerator
```

Se hacen 10 instancias con pm2:

```bash
npm run voterKeyGeneratorPM2
```

Una vez termine se debe eliminar las instancias con pm2 y mergear las keys con el siguiente comando.

```bash
pm2 delete generateVoterKeys.js
npm run mergeVoterKeys
```

Los archivos temporales del nombre `private-public-keys[numero].txt` en el directorio ./Utilities/APIAutoridadElectoral/KeyGenerator/Keys pueden ser eliminados, siempre y cuando se deje el archivo ``private-public-keys.txt`` en el directorio APIAutoridadElectoral.

---

### Generación de Votantes y Elecciones

Una vez se tenga las claves generadas y en un archivo ./Utilities/APIAutoridadElectoral/private-public-keys.txt, se pasa a generar elecciones y votantes

Se pide por consola:

- La cantidad de elecciones
- La cantidad de circuitos
- La cantidad de partidos
- La cantidad de candidatos (distribuidos aleatoriamente entre los partidos)
- La cantidad de votantes

Se debe esperar que se muestre por pantalla que Mongoose logró guardar todos los batches de votantes.

```bash
npm run electionGenerator
```

El resultado se guarda en MongoDB en una base de datos "electoralAPI" configurada en Utilities/APIAutoridadElectoral/VoterGenerator.

---

## Autoridad Electoral

Para levantar la API de autoridad electoral, se debe haber generado los votantes y ejecutar el comando:

**Instancia única**

```bash
npm run electoralAPI
```

**Multiples instancias con PM2**

```bash
npm run electoralAPIPM2 -- {cantidad}
```

Se debe asignar adecuadamente la dirección IP y puerto de la base de datos de mongoDB, de la cual se extrae la información sobre elecciones y votantes, en el archivo de configuración en ./Utilities/MongoElectoralAPI/config.

En esta terminal se visualiza las requests recibidas

---

## Simulaciones de votos y queries

### Simulación de votos en grandes cantidades

Para configurar las cantidades y el offset de votos a enviar, se debe hacer uso del archivo de configuración en ./Utilities/VoteSimulator/config.

Se debe asignar adecuadamente la dirección IP y puerto de la base de datos de mongoDB.

```bash
npm run votingSimulation
```

---

### Simulación de queries en grandes cantidades

Para configurar las cantidades, el offset de votante a enviar, y los endpoints a los cuales hacerles requests (si se elimina uno del atributo routes, no se hace request a ese endpoint. RoutesDefault sirve de ejemplo de a los que se puede hacer request) se debe hacer uso del archivo de configuración en ./Utilities/QuerySimulator/config.

Se debe asignar adecuadamente la dirección IP y puerto de la base de datos de mongoDB.

```bash
npm run querySimulation
```

---

## Subsistemas

### QueueConsumer

Para separar siguiendo CQRS (Command and Query Responsability Separation) se tiene un consumidor de queries y un consumidor de commands.
Es necesario tener por lo menos una instancia corriendo de commandConsumer y queryConsumer para que funcionen el resto de los subsistemas.
Se puede configurar en el archivo ./SRC/QueueConsumer/Consumers/config/development.json:

- La conexión de redis para cache y bull
- La conexión a las bases de datos MySQL

<br/>

#### Instancias únicas

**QueryConsumer**

```bash
npm run queryConsumer
```

**CommandConsumer**

```bash
npm run commandConsumer
```

<br/>

#### Instancias multiples con PM2

**QueryConsumer**
Se recomienda que la cantidad sea un número multiplo de 3 para queryConsumer ya que se tiene 3 replicas de la base de datos mysql para repartir y de esa forma se distribuye equivalentemente en cada replica los consumers.

```bash
npm run queryConsumerPM2 -- {cantidad}
```

Ejemplo de 3 queryConsumers:

```bash
npm run queryConsumerPM2 -- 3
```

**CommandConsumer**

```bash
npm run commandConsumerPM2 -- {cantidad}
```

---

### ElectionSubSystem (Sistema encargado de obtener elecciones y enviar actas)

A este subsistema se le puede configurar en el archivo SRC/ElectionSubSystem/config/development.json:

- Las direccion de Redis por la cual
  - accede al cache
  - envía por bull queue las elecciones recibididas
- La dirección ip de la API de la autoridad electoral de la cual se obtienen los votantes y elecciones
- El tamaño del batch en el que se obtienen los votantes
- El momento en el que se obtienen las elecciones, donde asignando null en un parametro date, hour, minute hace que no se tome en cuenta ese parametro.
  - Por ejemplo, si se asigna null en todos los pararametros excepto en minute, se obtendra en cada hora en el cual el minuto se el mismo que el del parametro

```bash
npm run electionSubSystem
```

---

### VotingSubSystem (Sistema que expone WebAPI encargada de recibir http request de votos)

A este subsistema de le puede configurar en el archivo SRC/VotingSubSystem/config/development.json:

- El puerto que expone la WebAPI para recibir votos
- El tiempo maximo de timeout para la conexion con el cliente
- La conexión con redis para
  - cache
  - queue de bull
- El tipo de envío de notificación, recibiendo de parametro "SMS" o "EMAIL"
- Una flag testing que desactiva middlewares para hacer load testing con el VoteSimulator
- Una flag verbose para que se muestre por pantalla cada minuto un helper para debuggear en que método pueden haber errores

**Instancia única**

```bash
npm run votingSubSystem
```

**Multiples instancias con PM2**

```bash
npm run votingSubSystemPM2 -- {cantidad}
```

---

### QuerySubSystem (Sistema que expone WebAPI para queries y configuración del sistema)

A este subsistema se le puede configurar en el archivo SRC/QuerySubSystem/config/development.json:

- La conexión con MongoDB
- La conexión con Redis
- El puerto que expone la WebAPI
- El secreto de JWT
- El tipo de notificación que se envía, EMAIL o SMS
- Una flag "testing" que desactiva el uso de middlewares para hacer load testing con el VoteSimulator

**Instancia única**

```bash
npm run querySubSystem
```

**Multiples instancias con PM2**

```bash
npm run querySubSystemPM2 -- {cantidad}
```

---

### AuthSubSystem (Sistema FederatedIdentity que expone WebAPI y GRPC)

A este subsistema se le puede configurar:

- La conexión con MongoDB
- El puerto que expone la WebAPI
- El secreto de JWT

```bash
npm run authSubSystem
```
