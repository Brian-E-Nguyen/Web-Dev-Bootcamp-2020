// 'fs' stands for 'File system,' which is part of the Node module
const fs = require('fs');
const folderName = process.argv[2] || 'Project';
// console.log(fs);

// mkdir is the async version
// fs.mkdir('Dogs', {recursive: true}, (err) => {
//     console.log('IN THE CALLBACK')
//     if (err) throw err;
// });

try {
    fs.mkdirSync(folderName);
    fs.writeFileSync(`${folderName}/index.html`)
    fs.writeFileSync(`${folderName}/app.html`)
    fs.writeFileSync(`${folderName}/style.css`)
} catch (error) {
    console.log('SOMETHING WHEN WRONG!!!!!')
    console.log(error)
}