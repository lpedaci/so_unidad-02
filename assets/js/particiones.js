/* ═══════════════════════════════════════════════════
   particiones.js — Diagramas interactivos y detalles
   ═══════════════════════════════════════════════════ */

'use strict';

const details = {
  'mbr-inicio': {
    title: 'Inicio de cabecera MBR',
    meta:  'Tipo: Sector especial · Tamaño: 512 bytes · Posición: primer sector del disco',
    desc:  'Primer sector del disco. Contiene el código de arranque maestro, la tabla de particiones del disco y la firma de arranque. Si se daña, el disco no puede utilizarse hasta reconstruirlo. Es el punto único de falla del esquema MBR, a diferencia de GPT que tiene copia de respaldo.'
  },
  'mbr-p1': {
    title: 'Partición primaria C:',
    meta:  'Tipo: Primaria activa · Tamaño: 150 GB · Sistema de archivos: NTFS',
    desc:  'Las particiones primarias son el tipo principal de partición. Pueden usarse tanto para instalar un sistema operativo como para almacenar datos del usuario. En este caso aloja Windows; está marcada como "activa" para que el BIOS sepa desde dónde arrancar. El usuario común usa las primarias primero, antes de recurrir a lógicas.'
  },
  'mbr-p2': {
    title: 'Partición primaria D:',
    meta:  'Tipo: Primaria · Tamaño: 100 GB · Sistema de archivos: NTFS',
    desc:  'Segunda partición primaria destinada a datos del usuario. No tiene SO, pero sigue siendo una partición primaria. Separarla del sistema operativo es buena práctica: si hay que formatear C:, los datos en D: no se ven afectados.'
  },
  'mbr-ext': {
    title: 'Partición extendida',
    meta:  'Tipo: Extendida · Tamaño: 150 GB · Sin sistema de archivos propio',
    desc:  'Contenedor especial que ocupa el lugar de la cuarta partición primaria en MBR. No almacena archivos directamente ni se le asigna sistema de archivos. Su única función es contener particiones lógicas. En la práctica, el usuario común raramente llega a necesitarla: primero agota las primarias disponibles.'
  },
  'mbr-free': {
    title: 'Espacio sin asignar',
    meta:  'Estado: No particionado · Tamaño: ~80 GB',
    desc:  'Espacio disponible para crear nuevas particiones en el futuro. No puede utilizarse para guardar archivos hasta que se le asigne una partición y un sistema de archivos.'
  },
  'mbr-fin': {
    title: 'Fin de cabecera MBR',
    meta:  'Tipo: Marcador de cierre · Posición: al final del espacio gestionado por MBR',
    desc:  'Marca el límite final del espacio administrado por el esquema MBR. A diferencia de GPT, no contiene una copia de seguridad de la tabla de particiones. Si la cabecera de inicio MBR se corrompe, no hay manera automática de recuperarla desde este cierre.'
  },
  'gpt-pmbr': {
    title: 'Protective MBR',
    meta:  'Tipo: Sector de compatibilidad · Tamaño: 512 bytes · Posición: primer sector',
    desc:  'Sector MBR que indica que el disco usa GPT. Su función es proteger el disco: si alguna herramienta antigua solo entiende MBR, verá este sector marcado como "ocupado" y no sobrescribirá el GPT por error. No es el arranque real; es solo un escudo de compatibilidad.'
  },
  'gpt-header': {
    title: 'Inicio de cabecera GPT',
    meta:  'Tipo: Cabecera primaria · Posición: LBA 1 (segundo sector)',
    desc:  'Contiene la tabla de particiones GPT con la información de cada partición: GUID único, sector de inicio, sector de fin y atributos. También registra la ubicación del Backup al final del disco. Si se daña, el sistema busca automáticamente la copia de respaldo.'
  },
  'gpt-efi': {
    title: 'EFI System Partition (ESP)',
    meta:  'Tipo: EFI · Tamaño: 260 MB · Sistema de archivos: FAT32',
    desc:  'Partición especial donde el firmware UEFI busca los cargadores de arranque. Contiene los archivos necesarios para iniciar Windows, Linux u otros SO instalados. Se formatea siempre en FAT32 para garantizar compatibilidad universal con cualquier firmware.'
  },
  'gpt-msr': {
    title: 'Microsoft Reserved Partition (MSR)',
    meta:  'Tipo: Reservada · Tamaño: 16 MB',
    desc:  'Partición reservada por Windows para uso interno (por ejemplo, gestión de volúmenes dinámicos y actualizaciones). No tiene letra de unidad y no es visible en el Explorador de archivos. Windows la crea automáticamente al instalarse en un disco GPT.'
  },
  'gpt-win': {
    title: 'Partición primaria C:',
    meta:  'Tipo: Primaria · Tamaño: 240 GB · Sistema de archivos: NTFS',
    desc:  'Partición primaria donde se instala el sistema operativo. Las particiones primarias en GPT pueden usarse tanto para SO como para datos del usuario. En GPT no existe el concepto de "partición activa"; el gestor de arranque en la ESP apunta a esta partición.'
  },
  'gpt-data': {
    title: 'Partición primaria D: (datos)',
    meta:  'Tipo: Primaria · Tamaño: 160 GB · Sistema de archivos: NTFS',
    desc:  'Segunda partición primaria destinada al almacenamiento de datos del usuario. En GPT, todas las particiones de uso general son primarias: no hace falta recurrir a extendidas ni lógicas para tener varias particiones de datos.'
  },
  'gpt-free': {
    title: 'Espacio sin asignar',
    meta:  'Estado: No particionado · Tamaño: ~60 GB',
    desc:  'Espacio reservado para expansión futura. Puede aprovecharse para crear nuevas particiones primarias o ampliar una existente con herramientas como Disk Management o DiskPart.'
  },
  'gpt-backup': {
    title: 'Backup de cabecera GPT',
    meta:  'Tipo: Copia de seguridad · Posición: penúltimo sector del disco',
    desc:  'Copia completa de la cabecera GPT y la tabla de particiones. Ventaja clave de GPT sobre MBR: si la cabecera principal se daña, el sistema puede recuperarla automáticamente desde este backup. Es la razón por la que GPT es más resiliente ante fallos.'
  },
  'gpt-fin': {
    title: 'Fin de cabecera GPT',
    meta:  'Tipo: Marcador de cierre · Posición: último sector del disco',
    desc:  'Marca el límite final del disco gestionado por GPT. Junto al backup de cabecera que lo precede, forma el cierre del esquema. A diferencia del fin MBR, aquí sí hay información de recuperación disponible gracias al backup.'
  }
};

function showDetail(scheme, key) {
  const d = details[key];
  if (!d) return;
  document.getElementById('detail-' + scheme).innerHTML =
    `<strong>${d.title}</strong><div class="meta">${d.meta}</div><p>${d.desc}</p>`;
}

function switchScheme(scheme, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.scheme-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + scheme).classList.add('active');
}
