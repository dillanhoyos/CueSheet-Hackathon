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
        var hererString = lines.join('\n');
        var startString = 'T R A C K  L I S T I N G';
        var endString = 'M A R K E R S  L I S T I N G';
      hererString = hererString.substring(
        hererString.indexOf(startString) + startString.length, 
        hererString.indexOf(endString)
        );
      
      var trackStringIndicies = [];
      var lastIndex = 0;
      while (true){
        var trackStartIndex = hererString.indexOf("TRACK NAME", lastIndex);
        if(trackStartIndex == -1){
          trackStringIndicies.push(hererString.length);
          break;
        }
        trackStringIndicies.push(trackStartIndex);
        lastIndex = trackStartIndex + 10;
      }
      var trackStringList = [];
      for(var i = 0; i < trackStringIndicies.length-1; i++){
        trackStringList.push(hererString.substring(trackStringIndicies[i], trackStringIndicies[i+1]));
      }
      var result = [];
      for(var i = 0; i < trackStringList.length; i++){
        var clipRawList = trackStringList[i].split('\n');
        var clipStart = clipRawList.indexOf("CHANNEL \tEVENT   \tCLIP NAME                     \tSTART TIME    \tEND TIME            DURATION      \tTIMESTAMP         \tSTATE");
        var clips = [];
        for (var c = clipStart + 1; c < clipRawList.length; c++){
          if(clipRawList[c] != ""){
            var clipBreakdown = clipRawList[c].split('\t').map(item => item.trim());
            if(clipBreakdown[0] == '1'){
              clipBreakdown = clipBreakdown.slice(3, 6);
              var timeBreakdown = clipBreakdown[2].split(':');
              var timeInSecs = (timeBreakdown[0] * 60) + timeBreakdown[1];
              clips.push({
                'duration': timeInSecs,
              });
            }
          }
        }
        var trackName = trackStringList[i].split('\t');
        trackName = trackName[1].split('\n');
        result.push({
          "title": trackName[0], clips
        });
      }
      console.log(result);
    };

    reader.onerror= (e) => alert(e.target.error.name);

    reader.readAsText(file);
})



