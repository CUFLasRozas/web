const fs = require('fs');
const path = require('path');

function generarJSON(directory) {
  const results = {};

  const walk = (dir, parent) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        parent[file.name] = {};
        walk(fullPath, parent[file.name]);
      } else if (dir !== directory) { // Solo incluye archivos si no estamos en el directorio raíz
        parent[file.name] = file.name;
      }
    });
  };
  walk(directory, results);
  return results;
}

const directory = 'C:\\dev\\Angular\\cuf-las-rozas\\public\\assets\\fotos';
const data = generarJSON(directory);
fs.writeFileSync('C:\\dev\\Angular\\cuf-las-rozas\\public\\assets\\jsons\\listadoFotos.json', JSON.stringify(data, null, 2));