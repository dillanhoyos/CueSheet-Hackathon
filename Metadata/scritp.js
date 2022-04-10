

    const jsmediatags = window.jsmediatags;

    document.querySelector("#input").addEventListener("change", (event) => {
        const file = event.target.files[0];


        jsmediatags.read (file, {
            onSuccess: function(tag){

                var content = { 
                        "workTitle": tag.tags.title,
                        "iswc": tag.tags["xid "].data,
                        "instrumentVocal": "I",
                        "cueUsageCode": "B",
                        "duration": 32,
                        "sequenceNumber": "A1",
                        "numberOfUses": 3,
                        "cueIps": [
                        {
                            "ipName": tag.tags.artist,
                            "lastName": tag.tags["©wrt"].data,
                            "ipiNameNumber": tag.tags["atID"].data,
                            "ipFunction": "W"
                        }
                    ]
                };
                console.log(content);

            },
            onError: function(error){
                
                console.log(error);
            }

        })
    })