
let nf = new Intl.NumberFormat('en-GB');

function insertResultRow(type, bytes, time) {
    let speed = Math.floor(bytes/(time/1000));
    let tbody = document.getElementById("resultsTBody");
    let newRow = document.createElement("tr");
    let typeCell = document.createElement("td");
    typeCell.appendChild(document.createTextNode(type));
    let byteCell = document.createElement("td");
    byteCell.appendChild(document.createTextNode(nf.format(bytes)));
    let timeCell = document.createElement("td");
    timeCell.appendChild(document.createTextNode(nf.format(time) + "ms"));
    let speedBPSCell = document.createElement("td");
    speedBPSCell.appendChild(document.createTextNode(nf.format(Math.round(speed/8)) + "bps"));
    let speedMBPSCell = document.createElement("td");
    speedMBPSCell.appendChild(document.createTextNode(nf.format(Math.round(speed/(8*1024))) + "Mbps"));
    let speedGBPSCell = document.createElement("td");
    speedGBPSCell.appendChild(document.createTextNode(Math.round(speed/(8*1024*1024)) + "Gbps"));

    newRow.appendChild(typeCell);
    newRow.appendChild(byteCell);
    newRow.appendChild(timeCell);
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
    xhr.onprogress = updateProgress;
    xhr.onload = function () {
        // Process our return data
        if (xhr.status == 200) {
            let endtime = Date.now();
            let elapsed = endtime - starttime;
            console.log("Type: " + fType + " length: " + fSize + " time: " + elapsed);
            insertResultRow(fType, fSize, elapsed);
        } else {
            // What do when the request fails
            console.log('send failed');
        }
    };


    xhr.open('GET', "genfile.php?type=" + fType + "&length=" + fSize);
    xhr.send();
}

function updateProgress(evt){
    if (evt.lengthComputable){ 
        var percentComplete = (evt.loaded / evt.total) * 100;  
        document.getElementById("progressBar").value = Math.floor(percentComplete);
        console.log(nf.format(percentComplete));
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