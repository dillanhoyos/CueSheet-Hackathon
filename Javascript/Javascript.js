

const EditDecisionList = require('edl-genius');

let e = new EditDecisionList(29.97, 'cmx3600');
edl.readFile('/Users/dillannhoyos/Documents/CueSheet-Hackathon/Javascript/herer.txt')
  .then((edl) => {
    console.log(edl.events);
  })



let input = document.querySelector('input');

let textarea = document.querySelector('textarea');

input.addEventListener('change', () => {
    let files = input.files;

    if(files.length == 0) return;
    

    const file = files[0];
    let reader = new FileReader();

    reader.onload = (e) =>{
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        textarea.value = lines.join('\n');


    };

    reader.onerror= (e) => alert(e.target.error.name);

    reader.readAsText(file);
})




