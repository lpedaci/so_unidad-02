/* ═══════════════════════════════════════════════════
   archivos.js — Sistemas de archivos: selector y detalle
   ═══════════════════════════════════════════════════ */

'use strict';

const fsData = {
  fat32: {
    name: 'FAT32', color: '#2a52e8', year: '1996',
    maxFile: '4 GB', maxPart: '2 TB',
    desc: 'El formato más veterano en uso activo. Creado para reemplazar a FAT16, es compatible con prácticamente cualquier dispositivo incluyendo motherboards, consolas, cámaras y televisores. Su gran limitación es que no puede almacenar archivos mayores de 4 GB.',
    ok: ['Máxima compatibilidad de hardware', 'Ideal para USBs de arranque (booteable)', 'Reconocido por firmware UEFI sin configuración'],
    no: ['No soporta archivos mayores a 4 GB', 'Particiones máximas de 2 TB', 'Sin permisos ni cifrado', 'Mayor fragmentación de archivos']
  },
  ntfs: {
    name: 'NTFS', color: '#1a7a4a', year: '1993',
    maxFile: '16 TB', maxPart: '16 EB',
    desc: 'Sistema de archivos de Microsoft, sucesor de FAT32. Diseñado para discos internos de Windows. Soporta permisos de acceso (ACL), cifrado (EFS/BitLocker), compresión, journaling para recuperación ante fallos, y archivos de hasta 16 TB. Es propietario: Mac y Linux solo pueden leerlo nativamente.',
    ok: ['Ideal para disco interno de Windows', 'Permisos y seguridad por archivo/carpeta', 'Cifrado con BitLocker o EFS', 'Journaling: recuperación ante fallos', 'Archivos y particiones muy grandes'],
    no: ['Mac y Linux: solo lectura nativa', 'No ideal para dispositivos extraíbles', 'Overkill para almacenamiento pequeño']
  },
  exfat: {
    name: 'exFAT', color: '#a05a00', year: '2006',
    maxFile: '16 EB', maxPart: '16 EB',
    desc: 'Diseñado por Microsoft para reemplazar FAT32 en dispositivos externos. Es más liviano que NTFS (sin permisos ni journaling) pero sin las limitaciones de FAT32. Compatible de forma nativa con Windows, macOS y Linux.',
    ok: ['Compatible con Windows, Mac y Linux', 'Sin límite práctico de tamaño de archivo', 'Más liviano que NTFS', 'Ideal para USBs y SSDs externos'],
    no: ['Sin permisos ni cifrado', 'Sin journaling (más vulnerable a corrupción)', 'No apto para disco de arranque de Windows']
  },
  fat: {
    name: 'FAT', color: '#b83030', year: '1977',
    maxFile: '4 GB', maxPart: '4 GB',
    desc: 'El sistema de archivos original de DOS. Todavía se usa en contextos muy específicos por su extrema simplicidad. Existen variantes (FAT12, FAT16, FAT32); en la práctica moderna, "FAT" sin más suele referir a FAT16. Prácticamente en desuso para almacenamiento general.',
    ok: ['Compatibilidad con hardware muy antiguo', 'Estructura simple y de bajo nivel'],
    no: ['Límite de volumen de solo 4 GB', 'Sin seguridad ni permisos', 'Sin journaling', 'No apto para uso moderno general']
  }
};

function selectFS(key) {
  document.querySelectorAll('.fs-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.' + key + '-c').classList.add('selected');
  const d = fsData[key];
  document.getElementById('fs-detail-box').innerHTML = `
    <h3 style="color:${d.color}">
      <span style="font-family:var(--mono);font-size:22px">${d.name}</span>
      <span class="pill pill-gray" style="font-size:11px">desde ${d.year}</span>
    </h3>
    <p style="font-size:14px;color:var(--text2);margin-bottom:1rem">${d.desc}</p>
    <div class="fs-detail-grid" style="margin-bottom:1rem">
      <div class="fs-stat">
        <div class="label">Archivo máximo</div>
        <div class="value" style="color:${d.color}">${d.maxFile}</div>
      </div>
      <div class="fs-stat">
        <div class="label">Partición máxima</div>
        <div class="value" style="color:${d.color}">${d.maxPart}</div>
      </div>
    </div>
    <ul class="use-list">
      ${d.ok.map(x => `<li class="ok">${x}</li>`).join('')}
      ${d.no.map(x => `<li class="no">${x}</li>`).join('')}
    </ul>`;
}

// Inicializar con FAT32 seleccionado
document.addEventListener('DOMContentLoaded', () => selectFS('fat32'));
