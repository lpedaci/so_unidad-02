/* ═══════════════════════════════════════════════════
   usuarios.js — Casos de usuario A–F, tarjetas y modal
   ═══════════════════════════════════════════════════ */

'use strict';

const users = [
  {
    id: 'A', title: 'Usuario A',
    desc: 'HDD 500 GB · Windows 10 · 64 bits · 4 GB RAM',
    color: '#2a52e8', bg: 'var(--accent-bg)',
    tags: ['HDD 500 GB', 'Windows 10', 'MBR + GPT'],
    hardware: 'PC 64 bits, 4 GB RAM DDR4, HDD 500 GB',
    uso: 'Windows 10 como SO principal + información personal y trabajo',
    disks: [
      { label: 'HDD 500 GB · Esquema MBR', segs: [
        { name:'Inicio MBR',  w:3,  c:'cell-boot'       },
        { name:'C: Windows',  size:'150 GB', type:'Primaria · SO · NTFS',   w:30, c:'cell-primary'   },
        { name:'D: Trabajo',  size:'100 GB', type:'Primaria · datos · NTFS', w:20, c:'cell-primary'   },
        { name:'E: Personal', size:'150 GB', type:'Lógica · NTFS',           w:30, c:'cell-logical'   },
        { name:'Sin asignar', size:'~80 GB', w:13, c:'cell-unassigned' },
        { name:'Fin MBR',     w:4,  c:'cell-boot'       }
      ]},
      { label: 'HDD 500 GB · Esquema GPT (alternativa)', segs: [
        { name:'EFI',         size:'260MB',  type:'FAT32',              w:3,  c:'cell-efi'        },
        { name:'MSR',         size:'16MB',   w:3,  c:'cell-msr'        },
        { name:'C: Windows',  size:'150 GB', type:'Primaria · SO · NTFS', w:27, c:'cell-primary'  },
        { name:'D: Trabajo',  size:'100 GB', type:'Primaria · NTFS',    w:20, c:'cell-primary'    },
        { name:'E: Personal', size:'150 GB', type:'Primaria · NTFS',    w:25, c:'cell-data'       },
        { name:'Sin asignar', size:'~80 GB', w:16, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',     w:3,  c:'cell-efi'        }
      ]}
    ],
    respuestas: [
      { q:'1) Tipo de formateo',  a:'Formateo Normal-Completo. Al tener datos previos, se deben eliminar rutas y estructura de archivos, y verificar sectores defectuosos.' },
      { q:'2) MBR: esquema',      a:'Inicio MBR → Primaria activa C: (SO, 150 GB, NTFS) → Primaria D: (Trabajo, 100 GB, NTFS) → Extendida con lógica E: (Personal, 150 GB, NTFS) → Sin asignar → Fin MBR.' },
      { q:'3) GPT: esquema',      a:'EFI (260 MB, FAT32) → MSR (16 MB) → Primaria C: (SO) → Primaria D: (Trabajo) → Primaria E: (Personal) → Sin asignar → Backup cabecera GPT → Fin GPT.' },
      { q:'4) Sistema de archivos', a:'NTFS para todas las particiones: soporta archivos grandes, permisos de acceso, journaling y cifrado.' }
    ]
  },
  {
    id: 'B', title: 'Usuario B',
    desc: 'SSD 480 GB · Windows 11 · 64 bits · 16 GB RAM',
    color: '#1a7a4a', bg: 'var(--green-bg)',
    tags: ['SSD 480 GB', 'Windows 11', 'GPT obligatorio'],
    hardware: 'PC 64 bits, 16 GB RAM 3200MHz, SSD 480 GB',
    uso: 'Windows 11 como SO principal + información personal',
    disks: [
      { label: 'SSD 480 GB · Esquema GPT (obligatorio para Win11)', segs: [
        { name:'EFI',              size:'260MB', type:'FAT32',           w:3,  c:'cell-efi'        },
        { name:'MSR',              size:'16MB',  w:2,  c:'cell-msr'      },
        { name:'C: Windows 11',    size:'250 GB',type:'Primaria · SO · NTFS', w:40, c:'cell-primary' },
        { name:'D: Personal',      size:'180 GB',type:'Primaria · datos · NTFS', w:36, c:'cell-data' },
        { name:'Sin asignar',      size:'~30 GB',w:13, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',          w:3,  c:'cell-efi'          }
      ]}
    ],
    respuestas: [
      { q:'1) Esquema de particiones', a:'GPT es obligatorio. Windows 11 requiere UEFI y GPT para instalarse. Además GPT soporta hasta 128 particiones primarias y tiene backup de cabecera.' },
      { q:'2) Tipo de formato',        a:'Formato Rápido para una unidad nueva (SSD sin datos previos). Si fuera de segunda mano: Formateo Normal-Completo para verificar sectores.' },
      { q:'3) Sistema de archivos',    a:'NTFS para todas las particiones internas. Permite permisos, cifrado BitLocker, journaling y archivos de hasta 16 TB.' }
    ]
  },
  {
    id: 'C', title: 'Usuario C',
    desc: 'SSD 500 GB + HDD 1 TB · Dual boot · 120 GB libres',
    color: '#a05a00', bg: 'var(--amber-bg)',
    tags: ['SSD 500 GB', 'HDD 1 TB', 'Dual boot'],
    hardware: 'SSD 500 GB (para SOs) + HDD 1 TB (para datos)',
    uso: 'Dos sistemas operativos en simultáneo + datos personales',
    disks: [
      { label: 'SSD 500 GB · GPT · Sistemas operativos', segs: [
        { name:'EFI',          size:'260MB', w:3,  c:'cell-efi'        },
        { name:'MSR',          size:'16MB',  w:2,  c:'cell-msr'        },
        { name:'C: Windows',   size:'200 GB',type:'Primaria · NTFS',   w:32, c:'cell-primary'   },
        { name:'Linux',        size:'150 GB',type:'Primaria · ext4',   w:24, c:'cell-extended'  },
        { name:'Swap',         size:'8 GB',  type:'Lógica Linux',      w:6,  c:'cell-logical'   },
        { name:'Libre ≥120 GB',w:27, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',      w:3,  c:'cell-efi'         }
      ]},
      { label: 'HDD 1 TB · GPT · Datos personales', segs: [
        { name:'EFI',          w:3,  c:'cell-efi'         },
        { name:'Documentos',   size:'250 GB',type:'Primaria · NTFS',   w:25, c:'cell-data'      },
        { name:'Multimedia',   size:'300 GB',type:'Primaria · NTFS',   w:30, c:'cell-data'      },
        { name:'Backup',       size:'80 GB', type:'Primaria · NTFS',   w:17, c:'cell-primary'   },
        { name:'Libre ≥220 GB',type:'≥15% sin asignar',  w:19, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',      w:3,  c:'cell-efi'         }
      ]}
    ],
    respuestas: [
      { q:'1) Unidad para SOs',         a:'SSD (500 GB) para los SO: mayor velocidad de lectura/escritura. HDD (1 TB) para datos: mayor capacidad a menor costo.' },
      { q:'2) SSD: organización',       a:'GPT: EFI → MSR → Partición Windows (NTFS) → Partición Linux (ext4) → Swap → al menos 120 GB sin asignar → Backup GPT → Fin GPT.' },
      { q:'3) HDD: organización y SA',  a:'GPT: EFI → Documentos (NTFS) → Multimedia (NTFS) → Backup (NTFS) → mínimo 220 GB libre + 15% sin asignar → Backup GPT → Fin GPT.' }
    ]
  },
  {
    id: 'D', title: 'Usuario D',
    desc: 'HDD 2 TB de segunda mano · 3 particiones + espacio libre',
    color: '#b83030', bg: 'var(--red-bg)',
    tags: ['HDD 2 TB', 'Segunda mano', 'GPT'],
    hardware: 'HDD 2 TB adquirido en Mercado Libre, poco tiempo de uso',
    uso: 'Guardar archivos importantes',
    disks: [
      { label: 'HDD 2 TB · Esquema GPT · Solo almacenamiento', segs: [
        { name:'EFI',               w:3,  c:'cell-efi'         },
        { name:'Archivos A',  size:'600 GB',type:'Primaria · NTFS', w:28, c:'cell-primary'  },
        { name:'Archivos B',  size:'600 GB',type:'Primaria · NTFS', w:28, c:'cell-primary'  },
        { name:'Backup datos',size:'400 GB',type:'Primaria · NTFS', w:24, c:'cell-data'     },
        { name:'Sin asignar', size:'~400 GB',w:11, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',            w:3,  c:'cell-efi'        }
      ]}
    ],
    respuestas: [
      { q:'1) Previo a usar: tipo de formateo',  a:'Formateo Bajo Nivel o Normal-Completo. Al ser de segunda mano: (a) borrar datos del dueño anterior, (b) verificar sectores defectuosos. El Formateo Rápido no es suficiente.' },
      { q:'2) Esquema de particiones',           a:'GPT: el HDD es de 2 TB, límite máximo para MBR. GPT no tiene esa restricción y tiene backup de cabecera.' },
      { q:'3) Tipo de formato de particiones',   a:'Formato Normal-Completo para la primera vez (verifica errores). Las tres particiones son primarias en GPT.' },
      { q:'4) Sistema de archivos',              a:'NTFS para las tres: el disco supera 2 TB (límite de FAT32), necesita soportar archivos grandes y está en un equipo Windows.' }
    ]
  },
  {
    id: 'E', title: 'Usuario E',
    desc: 'HDD 500 GB (MBR) + SSD 250 GB (GPT) en PC UEFI',
    color: '#7a4ab8', bg: '#f0eafd',
    tags: ['HDD MBR', 'SSD GPT', 'UEFI', 'Esquemas mixtos'],
    hardware: 'PC con firmware UEFI, HDD 500 GB (MBR, reciclado), SSD 250 GB (GPT)',
    uso: 'Combinar ambas unidades con distintos esquemas',
    disks: [
      { label: 'HDD 500 GB · Esquema MBR (heredado)', segs: [
        { name:'Inicio MBR',  w:3,  c:'cell-boot'      },
        { name:'C: Datos',    size:'200 GB',type:'Primaria · NTFS', w:38, c:'cell-primary'  },
        { name:'D: Personal', size:'150 GB',type:'Primaria · NTFS', w:28, c:'cell-primary'  },
        { name:'Extendida',   size:'100 GB',type:'→ lógicas',       w:21, c:'cell-extended' },
        { name:'Sin asignar', size:'~30 GB',w:6, c:'cell-unassigned' },
        { name:'Fin MBR',     w:4,  c:'cell-boot'      }
      ]},
      { label: 'SSD 250 GB · Esquema GPT (SO principal)', segs: [
        { name:'EFI',               size:'260MB',type:'FAT32',           w:4,  c:'cell-efi'        },
        { name:'MSR',               size:'16MB',  w:3,  c:'cell-msr'     },
        { name:'C: Windows',        size:'150 GB',type:'Primaria · NTFS', w:47, c:'cell-primary'   },
        { name:'D: Rápido',         size:'60 GB', type:'Primaria · NTFS', w:28, c:'cell-data'      },
        { name:'Sin asignar',       size:'~20 GB',w:12, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',           w:3,  c:'cell-efi'         }
      ]}
    ],
    respuestas: [
      { q:'1) ¿Se pueden usar ambos esquemas en la misma PC?', a:'Sí. Una PC UEFI puede arrancar desde un disco GPT mientras los discos adicionales (aunque sean MBR) se usan como almacenamiento de datos.' },
      { q:'2) ¿Cuándo cambiar el MBR del HDD?',               a:'Si se desea agregar más de 4 particiones, si el disco supera 2 TB, o si se quiere uniformidad. También si hay problemas de corrupción del sector MBR.' },
      { q:'3) Pasos previos para reutilizar el HDD',           a:'(1) Copia de seguridad de los datos existentes. (2) Formateo Normal-Completo o Bajo Nivel para verificar sectores. (3) Si se cambia a GPT: reparticionar y formatear (se pierden todos los datos).' }
    ]
  },
  {
    id: 'F', title: 'Usuario F',
    desc: 'SSD 240 GB único · uso laboral y ofimática',
    color: '#1a5a3a', bg: '#e3f5ec',
    tags: ['SSD 240 GB', 'Presupuesto limitado', 'GPT', 'Uso laboral'],
    hardware: 'SSD 240 GB (único disco, SO + datos)',
    uso: 'Trabajo, navegación web, ofimática. Posible expansión futura.',
    disks: [
      { label: 'SSD 240 GB · Esquema GPT · Único disco', segs: [
        { name:'EFI',               size:'260MB',type:'FAT32',           w:3,  c:'cell-efi'        },
        { name:'MSR',               size:'16MB',  w:3,  c:'cell-msr'     },
        { name:'C: Windows',        size:'100 GB',type:'Primaria · NTFS', w:38, c:'cell-primary'   },
        { name:'D: Trabajo',        size:'120 GB',type:'Primaria · NTFS', w:44, c:'cell-data'      },
        { name:'Sin asignar',       size:'~10 GB',w:6,  c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',           w:3,  c:'cell-efi'         }
      ]},
      { label: 'HDD externo recomendado (futuro) · 1 TB · GPT', segs: [
        { name:'EFI',               w:3,  c:'cell-efi'         },
        { name:'Documentos',  size:'400 GB',type:'Primaria · NTFS', w:37, c:'cell-data'      },
        { name:'Backup datos',size:'400 GB',type:'Primaria · NTFS', w:37, c:'cell-data'      },
        { name:'Sin asignar', size:'~200 GB',w:17, c:'cell-unassigned' },
        { name:'Backup cabecera GPT', w:3, c:'cell-gpt-backup' },
        { name:'Fin GPT',            w:3,  c:'cell-efi'        }
      ]}
    ],
    respuestas: [
      { q:'1) Esquema y particiones',     a:'GPT para el SSD. Particiones: EFI (260 MB, FAT32) + MSR (16 MB) + C: Windows (~100 GB, NTFS) + D: Trabajo (~120 GB, NTFS).' },
      { q:'2) Distribución de espacio',   a:'100 GB para el SO (Windows ocupa ~30-50 GB; margen para apps). 120 GB para archivos de trabajo y ofimática. ~10 GB sin asignar como margen.' },
      { q:'3a) ¿HDD o SSD para ampliar?', a:'HDD: mayor capacidad por menor precio. Para uso laboral (documentos, ofimática) no es crítica la velocidad extra de un SSD.' },
      { q:'3b) Esquema y tipo de partición', a:'GPT con particiones primarias (no hace falta la extendida en GPT). Dos particiones: Documentos + Backup.' },
      { q:'3c) Sistema de archivos recomendado', a:'NTFS: el HDD se usará solo en Windows, necesita soportar archivos grandes y NTFS ofrece journaling. Si se compartiera entre SO: exFAT.' }
    ]
  }
];

/* ── BUILDERS ── */
function buildMiniBar(segs) {
  return segs.map(s =>
    `<div class="s ${s.c}" style="width:${s.w}%"></div>`
  ).join('');
}

function buildFullBar(segs) {
  let num = 0;
  return segs.map(s => {
    const narrow = s.w <= 5;
    if (narrow) num++;
    return `<div class="df-seg ${s.c}${narrow ? ' narrow' : ''}" style="width:${s.w}%">
      ${narrow
        ? `<span class="seg-num" style="font-family:var(--mono);font-size:15px;font-weight:700;color:#fff">${num}</span>`
        : `<span class="sn">${s.name}</span>
           ${s.size ? `<span class="sz">${s.size}</span>` : ''}
           ${s.type ? `<span class="st">${s.type}</span>` : ''}`
      }
    </div>`;
  }).join('');
}

function buildDiskLegend(segs) {
  const colorMap = {
    'cell-boot':       '#4a72f8',
    'cell-primary':    '#5b8dd9',
    'cell-extended':   '#2d6a4f',
    'cell-logical':    '#52b788',
    'cell-data':       '#1a7a4a',
    'cell-efi':        '#4a72f8',
    'cell-msr':        '#7a4ab8',
    'cell-gpt-backup': '#d4720a',
    'cell-unassigned': '#d8d5cf'
  };
  let num = 0;
  const items = segs.map(s => {
    const narrow = s.w <= 5;
    if (narrow) num++;
    const bg    = colorMap[s.c] || '#888';
    const label = narrow ? `${num}. ${s.name}` : `${s.name}${s.size ? ' · ' + s.size : ''}`;
    return `<div class="disk-legend-item">
      <div class="disk-legend-num" style="background:${bg}">${narrow ? num : ''}</div>
      <span>${label}</span>
    </div>`;
  });
  return `<div class="disk-legend">${items.join('')}</div>`;
}

/* ── GRID ── */
function renderUserGrid() {
  const grid = document.getElementById('user-grid');
  if (!grid) return;

  users.forEach(u => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-card-header">
        <div class="user-avatar" style="background:${u.bg};color:${u.color}">${u.id}</div>
        <div><h3>${u.title}</h3><p>${u.desc}</p></div>
      </div>
      <div class="user-disk">
        <div class="disk-label">${u.disks[0].label}</div>
        <div class="disk-mini">${buildMiniBar(u.disks[0].segs)}</div>
      </div>
      <div class="user-tags">${u.tags.map(t => `<span class="pill pill-gray">${t}</span>`).join('')}</div>`;
    card.onclick = () => openModal(u);
    grid.appendChild(card);
  });
}

/* ── MODAL ── */
function openModal(u) {
  document.getElementById('modal-header').innerHTML = `
    <div class="user-avatar" style="background:${u.bg};color:${u.color};font-size:20px">${u.id}</div>
    <div>
      <h2>${u.title}</h2>
      <p>${u.hardware}</p>
      <p style="color:var(--text3)">${u.uso}</p>
    </div>`;

  document.getElementById('modal-body').innerHTML =
    u.disks.map(d => `
      <div class="disk-full">
        <div class="disk-full-header">${d.label}</div>
        <div class="disk-full-bar">${buildFullBar(d.segs)}</div>
        ${buildDiskLegend(d.segs)}
      </div>`).join('') +
    `<ul class="resp-list">
      ${u.respuestas.map(r => `<li class="resp-item"><strong>${r.q}</strong>${r.a}</li>`).join('')}
    </ul>`;

  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalBtn();
}

function closeModalBtn() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', renderUserGrid);
