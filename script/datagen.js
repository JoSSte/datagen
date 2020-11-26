
let nf = new Intl.NumberFormat(navigator.language);

function insertResultRow(type, bytes, timeTotal, timeGen) {
    let timeDL = timeTotal - timeGen;
    let speed = Math.floor((bytes*8)/timeDL);
    let tbody = document.getElementById("resultsTBody");
    let newRow = document.createElement("tr");
    let typeCell = document.createElement("td");
    typeCell.appendChild(document.createTextNode(type));
    let byteCell = document.createElement("td");
    byteCell.appendChild(document.createTextNode(nf.format(bytes)));
    let timeTotalCell = document.createElement("td");
    timeTotalCell.appendChild(document.createTextNode(nf.format(timeTotal) + "s"));
    let timeGenCell = document.createElement("td");
    timeGenCell.appendChild(document.createTextNode(nf.format(timeGen) + "s"));
    let timeDLCell = document.createElement("td");
    timeDLCell.appendChild(document.createTextNode(nf.format(timeDL) + "s"));
    let speedBPSCell = document.createElement("td");
    speedBPSCell.appendChild(document.createTextNode(nf.format(Math.round(speed)) + " bit/s"));
    let speedMBPSCell = document.createElement("td");
    speedMBPSCell.appendChild(document.createTextNode(nf.format(Math.round(speed/1024)) + " Kbit/s"));
    let speedGBPSCell = document.createElement("td");
    speedGBPSCell.appendChild(document.createTextNode(Math.round(speed/(1024*1024)) + " Mbit/s"));

    newRow.appendChild(typeCell);
    newRow.appendChild(byteCell);
    newRow.appendChild(timeTotalCell);
    newRow.appendChild(timeGenCell);
    newRow.appendChild(timeDLCell);
    newRow.appendChild(speedBPSCell);
    newRow.appendChild(speedMBPSCell);
    newRow.appendChild(speedGBPSCell);
    tbody.appendChild(newRow);
}

function getFile(fType) {
    let xhr = new XMLHttpRequest();

    let starttime = Date.now();
    let fSize = parseInt(document.getElementById("length").value);
    console.log("Requesting " + fSize + " bytes of " + fType + " data");
    document.getElementById("progressBar").value = 0;
    xhr.onprogress = updateProgress;
    xhr.onload = function () {
        // Process our return data
        if (xhr.status == 200) {
            let endtime = Date.now();
            let elapsed = (endtime - starttime)/1000;
            let serverTiming = xhr.getResponseHeader("Server-Timing");
            let label = "gen;dur=";
            let timeGen = serverTiming.substr(serverTiming.indexOf(label)+label.length,5);
            console.log("Type: " + fType + " length: " + fSize + " time: " + elapsed + " gentime: "+ timeGen);
            insertResultRow(fType, fSize, elapsed, timeGen);
        } else {
            // What do when the request fails
            console.log('send failed');
        }
    };


    xhr.open('GET', "backend/genfile.php?type=" + fType + "&length=" + fSize);
    xhr.send();
}

function updateProgress(evt){
    if (evt.lengthComputable){ 
        var percentComplete = (evt.loaded / evt.total) * 100;  
        document.getElementById("progressBar").value = Math.floor(percentComplete);
        //console.log(nf.format(percentComplete));
    }
}

/**
 * 
 * @param {element this is called from} elem 
 */
function updateBytes(elem){
    console.log(elem.id);
    switch(elem.id){
        case "length":
            document.getElementById("lengthKB").value = parseInt(elem.value) / 1024;
            document.getElementById("lengthMB").value = parseInt(elem.value) / ( 1024 * 1024 );
            break;
        case "lengthKB":
            document.getElementById("length").value = parseInt(elem.value) * 1024;
            document.getElementById("lengthMB").value = parseInt(elem.value) / 1024;
            break;
        case "lengthMB":
            document.getElementById("lengthKB").value = parseInt(elem.value) * 1024;
            document.getElementById("length").value = parseInt(elem.value) * ( 1024 * 1024 );
            break;
    }

}