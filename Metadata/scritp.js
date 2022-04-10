

    const jsmediatags = window.jsmediatags;

    document.querySelector("#input").addEventListener("change", (event) => {
        const file = event.target.files[0];


        jsmediatags.read (file, {
            onSuccess: function(tag){
                    
        //    console.log(tag);

        //             console.log(tag.tags.title);
        //             console.log(tag.tags.artist);
        //             console.log(tag.tags["©wrt"].data);
        //             console.log(tag.tags["xid "].data);
        //             console.log(tag.tags["atID"].data);

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
             }]
            };
            console.log(content);


                    



                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";

                // for(let i = 0;i < data.length; i++) 
                //     base64String += String.fromCharCode(data[i]);
                        

                     
                
                // document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
                // document.querySelector("#title").textContent = tag.tags.title; 
                // document.querySelector("#artist").textContent = tag.tags.artist; 
                // document.querySelector("#album").textContent = tag.tags.album; 
                // document.querySelector("#genre").textContent = tag.tags.genre; 

           
            },
            onError: function(error){
                
                console.log(error);
            }

        })
    })