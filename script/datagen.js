
let nf = new Intl.NumberFormat("en");

function insertResultRow(type, bytes, timeTotal, timeGen, currentRow) {
    timeGen = parseInt(timeGen);
    let timeDL = timeTotal - timeGen;
    let speed = Math.round((bytes * 8) / timeDL);
    let speedKB = Math.round(speed / 1024);
    let speedMB = Math.round(speed / (1024 * 1024));

    
    let tbody = document.getElementById("resultsTBody");
    if(currentRow == 'undefined'){//if for some reason the currentRow is undefined, create a new row
        currentRow = document.createElement("tr");
    }else {//if exists, remove td wih progressbar
        currentRow.removeChild(currentRow.firstChild);
        tbody.appendChild(currentRow);
    }
    let typeCell = document.createElement("td");
    typeCell.appendChild(document.createTextNode(type));
    let byteCell = document.createElement("td");
    byteCell.appendChild(document.createTextNode(nf.format(bytes)));
    let timeTotalCell = document.createElement("td");
    timeTotalCell.appendChild(document.createTextNode(nf.format(timeTotal)));
    let timeGenCell = document.createElement("td");
    timeGenCell.appendChild(document.createTextNode(nf.format(timeGen)));
    let timeDLCell = document.createElement("td");
    timeDLCell.appendChild(document.createTextNode(nf.format(timeDL)));
    let speedBPSCell = document.createElement("td");
    speedBPSCell.appendChild(document.createTextNode(nf.format(speed)));
    let speedKBPSCell = document.createElement("td");
    speedKBPSCell.appendChild(document.createTextNode(nf.format(speedKB)));
    let speedMBPSCell = document.createElement("td");
    speedMBPSCell.appendChild(document.createTextNode(speedMB));

    currentRow.appendChild(typeCell);
    currentRow.appendChild(byteCell);
    currentRow.appendChild(timeTotalCell);
    currentRow.appendChild(timeGenCell);
    currentRow.appendChild(timeDLCell);
    currentRow.appendChild(speedBPSCell);
    currentRow.appendChild(speedKBPSCell);
    currentRow.appendChild(speedMBPSCell);


    // update mean values
    let body = document.getElementById("resultsTBody");
    let speedAvgCell = document.getElementById("speedAvgB")
    let speedAvgKBCell = document.getElementById("speedAvgKB")
    let speedAvgMBCell = document.getElementById("speedAvgMB")
    let timeAvgDLCell = document.getElementById("timeAvgDL")

    let numRows = body.childElementCount;

    if (numRows == 1) {
        //set initial values
        speedAvgCell.innerText = speed;
        speedAvgKBCell.innerText = speedKB;
        speedAvgMBCell.innerText = speedMB;
        timeAvgDLCell.innerText = timeDL;
    } else {
        //update existing cumulative average
        speedAvgCell.innerText = nf.format(((parseFloat(speedAvgCell.innerText) * numRows) + speed) / (numRows + 1));
        speedAvgKBCell.innerText = nf.format(((parseFloat(speedAvgKBCell.innerText) * numRows) + speedKB) / (numRows + 1));
        speedAvgMBCell.innerText = nf.format(((parseFloat(speedAvgMBCell.innerText) * numRows) + speedMB) / (numRows + 1));
        timeAvgDLCell.innerText = nf.format(((parseFloat(timeAvgDLCell.innerText) * numRows) + timeDL) / (numRows + 1));
    }
}

function getFile(fType) {
    let xhr = new XMLHttpRequest();

    let starttime = Date.now();
    let fSize = parseInt(document.getElementById("length").value);
    console.log("Requesting " + fSize + " bytes of " + fType + " data");
    let progElem = createProgressElement();
    xhr.onprogress = function (evt) {
        if (evt.lengthComputable) {
            var percentComplete = (evt.loaded / evt.total) * 100;
            progElem.value = Math.floor(percentComplete);
            //console.log(nf.format(percentComplete));
        }
    };
    xhr.onload = function () {
        // Process our return data
        if (xhr.status == 200) {
            let endtime = Date.now();
            let elapsed = (endtime - starttime) / 1000;
            let serverTiming = xhr.getResponseHeader("Server-Timing");
            let label = "gen;dur=";
            let timeGen = serverTiming.substr(serverTiming.indexOf(label) + label.length, 5);
            console.log("Type: " + fType + " length: " + fSize + " time: " + elapsed + " gentime: " + timeGen);
            insertResultRow(fType, fSize, elapsed, timeGen, progElem.parentElement.parentElement);
        } else {
            // What do when the request fails
            console.log('send failed');
        }
    };


    xhr.open('GET', "backend/genfile.php?type=" + fType + "&length=" + fSize);
    xhr.send();
}


function createProgressElement(){
    let newRow = document.createElement("tr");
    let progressCell = document.createElement("td");
    progressCell.colSpan = 8;
    let progressElement = document.createElement("progress");
    progressElement.max = 100;
    progressElement.value = 0;
    progressElement.style.width = "100%";
    progressCell.appendChild(progressElement);
    newRow.appendChild(progressCell);
    document.getElementById("resultsTBody").appendChild(newRow);
    return progressElement;
}

/**
 * 
 * @param {element this is called from} elem 
 */
function updateBytes(elem) {
    console.log(elem.id);
    switch (elem.id) {
        case "length":
            document.getElementById("lengthKB").value = parseInt(elem.value) / 1024;
            document.getElementById("lengthMB").value = parseInt(elem.value) / (1024 * 1024);
            break;
        case "lengthKB":
            document.getElementById("length").value = parseInt(elem.value) * 1024;
            document.getElementById("lengthMB").value = parseInt(elem.value) / 1024;
            break;
        case "lengthMB":
            document.getElementById("lengthKB").value = parseInt(elem.value) * 1024;
            document.getElementById("length").value = parseInt(elem.value) * (1024 * 1024);
            break;
    }

}