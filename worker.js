const edlFile = document.getElementById('edlFile');
const audioFile = document.getElementById('audioFile');
const cueSheetOutput = document.getElementById('cueSheetOutput');
const outputForm = document.getElementById('output');
const createCueSheetButton = document.getElementById('createCueSheetButton');
const allCues = document.getElementById('allCues');

var audioFilesJson = [];
var edlJson = [];

function disableCueSheetButton(){
  if (edlFile.files.length != 0 && audioFile.files.length != 0) createCueSheetButton.removeAttribute('disabled');
  else{
    createCueSheetButton.disabled = true;
    outputForm.style.display = "none";
  }
}

edlFile.addEventListener('change', () => {
  disableCueSheetButton();
    let files = edlFile.files;

    if(files.length == 0) return;
    else {
      edlJson = parseEDL(files[0]);
    }
});

audioFile.addEventListener('change', () => {
  disableCueSheetButton();

  let files = audioFile.files;

  if (files.length == 0) return;
  else{
    audioFilesJson = parseAudioFile(files);
  }
});

function parseEDL(edl){
  const file = edl;
  let reader = new FileReader();
  var finalClips = [];

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
    var clips = [];
    for(var i = 0; i < trackStringList.length; i++){
      var clipRawList = trackStringList[i].split('\n');
      var clipStart = clipRawList.indexOf("CHANNEL \tEVENT   \tCLIP NAME                     \tSTART TIME    \tEND TIME            DURATION      \tTIMESTAMP         \tSTATE");
      for (var c = clipStart + 1; c < clipRawList.length; c++){
        if(clipRawList[c] != ""){
          var clipBreakdown = clipRawList[c].split('\t').map(item => item.trim());
          if(clipBreakdown[0] == '1'){
            clipName = clipBreakdown[2];
            clipName = clipName.split('.L')[0];
            clipBreakdown = clipBreakdown.slice(3, 6);
            var timeBreakdown = clipBreakdown[2].split(':');
            var timeInSecs = (timeBreakdown[0] * 60) + timeBreakdown[1];
            clips.push({
              'clipName' : clipName,
              'numberOfUses' : 1,
              'duration': parseInt(timeInSecs, 10)
            });
          }
        }
      }
      var trackName = trackStringList[i].split('\t');
      trackName = trackName[1].split('\n');
    }
    for(var i = 0; i < clips.length; i++){
      var foundIndex = finalClips.map((o) => o.clipName).indexOf(clips[i].clipName.split('-')[0]);
      if(foundIndex == -1){
        finalClips.push(clips[i]);
        continue;
      }
      finalClips[foundIndex]['numberOfUses']++;
      finalClips[foundIndex]['duration'] += clips[i]['duration'];
    }
  
  };
  reader.onerror= (e) => alert(e.target.error.name);
  reader.readAsText(file);
  return finalClips;
}

function parseAudioFile(files){
  var listOfWork = [];
  const jsmediatags = window.jsmediatags;
  for(var i = 0; i < files.length; i++){
    const file = files[i];
    jsmediatags.read(file, {
      onSuccess: function (tag) {
        listOfWork.push({
          "workTitle": tag.tags.title,
          "iswc": tag.tags["xid "].data,
          "instrumentVocal": "I",
          "cueUsageCode": "B",
          "duration": 0,
          "sequenceNumber": "A1",
          "numberOfUses": 0,
          "cueIps": [
            {
              "ipName": tag.tags.artist,
              "lastName": tag.tags["©wrt"].data,
              "ipiNameNumber": tag.tags["atID"].data,
              "ipFunction": "W"
            }
          ]
        });
      },
      onError: function (error) {
        console.log(error);
      }
    })
  }
  return listOfWork;
}

function createCueSheet(){
  try{
    if (edlJson.length == 0 || audioFilesJson.length == 0) throw 'one of your files failed';
    mergeEdlAndAudioJson();
    cueSheetOutput.value = JSON.stringify(audioFilesJson);
    cueSheetOutput.style.borderColor = "green";
    outputForm.style.display = "grid";
  }catch(e){
    alert('Error: ' + e);
  }
}

function mergeEdlAndAudioJson () {
  //iteration through audio files to find the edl entry and get duration and numOfUses
  for(var i = 0; i < audioFilesJson.length; i++){
    var foundIndex = edlJson.map((o) => o.clipName).indexOf(audioFilesJson[i]["workTitle"]);
    if(foundIndex != -1){
      audioFilesJson[i]['duration'] = edlJson[foundIndex]['duration'];
      audioFilesJson[i]['numberOfUses'] = edlJson[foundIndex]['numberOfUses'];
    }
  }
}

function placeAudioJsonIntoForm(){
  document.getElementById("avCues-avWorkTitle").value = '';
}



