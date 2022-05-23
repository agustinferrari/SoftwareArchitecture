# Obligatorio Arquitectura de Software Marzo 2022

## Alumnos:
- Agustín Ferrari 240503
- Joaquín Meerhoff 247096
- Graziano Pascale 186821

## Comandos:
En root:

### Build a todos los proyectos
```bash
npm run buildAll
```

### Correr electionSubSystem
```bash
npm run electionSubSystem
```

### Correr electoralAPI
```bash
npm run electoralAPI
```

## Dependencias

### Node-Scheduler
Utilizamos este module para llamar a funciones una vez que se llegue a una condicion de tiempo.
Particularmente lo utilizamos para llamar mensualmente a la API con las elecciones cargadas, dado un día y hora del mes (configurables)
Tambien se utiliza para darle inicio y cierre a las elecciones.