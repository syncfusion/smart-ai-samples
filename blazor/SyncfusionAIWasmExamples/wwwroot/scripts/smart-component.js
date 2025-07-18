﻿﻿﻿﻿window.canvasInterop = {
    imgSrc: "",
    onInitialized: function () {
        document.getElementById('img-upload').onchange = function (args) {
            const URL = window.URL; const url = URL.createObjectURL((args.target).files[0]);
            (document.getElementById('img-upload')).value = null;
            canvasInterop.imgSrc = url.toString();
            return window.objRef.invokeMethodAsync('FileSelected', url.toString());
        };
        return true;
    },
    getImageSource: function () {
        var img = document.querySelector('#custom-img'); // Add
        return img.src;
    },
    imageLoaded: function (objRef) {
        window.objRef = objRef;
        if (canvasInterop.imgSrc === '') {
            let canvas = document.querySelector('#img-canvas');
            let image = document.querySelector('#custom-img');
            let ctx = canvas.getContext('2d');
            canvas.width = image.width < image.height ? image.width : image.height;
            canvas.height = canvas.width;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            document.querySelector('.e-profile').classList.remove('e-hide');
        }
        return true;
    },
    fileSelect: function () {
        var inputFile = document.getElementById('img-upload');
        inputFile.click();
        return true;
    },
    applyImage: function (a) {
        var dataId = document.querySelector('.e-image-editor').getAttribute('dataId');
        var inst = window.sfBlazor.getCompInstance(dataId);
        var croppedData = inst.getImageData();
        var canvas = document.querySelector('#img-canvas');
        var ctx = canvas.getContext('2d');
        var parentDiv = document.querySelector('.e-profile');
        var tempCanvas = parentDiv.appendChild(document.createElement('canvas'));
        var tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = croppedData.width; tempCanvas.height = croppedData.height;
        tempContext.putImageData(croppedData, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        tempCanvas.remove();
        if (canvasInterop.imgSrc !== '') {
            const img = document.querySelector('#custom-img');
            img.src = canvasInterop.imgSrc;
        }
        return true;
    }
};

window.customToolbarInterop = {
    toolbarPosition: function () {
        setTimeout(() => {
            let toolbarArea = document.getElementById('top-toolbar');
            if (toolbarArea) {
                toolbarArea.style.left = (toolbarArea.parentElement.parentElement.clientWidth / 2) - (toolbarArea.clientWidth / 2) + 'px';
            }
            toolbarArea = document.getElementById('bottom-toolbar');
            if (toolbarArea) {
                toolbarArea.style.left = (toolbarArea.parentElement.parentElement.clientWidth / 2) - (toolbarArea.clientWidth / 2) + 'px';
            }
        }, 20);
    },
    loadBase64ImageIntoCanvas: function (canvasId, filter, base64Url) {
        var img = new Image();
        img.onload = function () {
            for (var i = 0; i < canvasId.length; i++) {
                var canvas = document.getElementById(canvasId[i]);
                var context = canvas.getContext('2d');
                context.filter = filter[i];
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            };
        img.src = base64Url;
    },
    dropdownPosition: function (element) {
        if (window.innerWidth <= 768) {
            var btnElem = document.querySelector('#bottom-toolbar .e-dropdown-btn.e-active');
            if (btnElem) {
                element.style.top = btnElem.getBoundingClientRect().top - element.offsetHeight + 'px';
                element.style.left = element.offsetLeft + 'px';
            }
        }
    },
    updateColorpicker: function (elemId, type, value) {
        var btnElem = document.querySelector(`.e-dropdownbtn-preview.${elemId}`);
        if (type == "shape-fill" && btnElem) {
            if (value == "") {
                btnElem.classList.add('e-nocolor-item');
            } else {
                btnElem.classList.remove('e-nocolor-item');
                btnElem.style.backgroundColor = value;
            }
        } else if (btnElem) {
            btnElem.style.backgroundColor = value;
        }
    }
}


//Interop scripts for smart image editor
async function getStabilityAiModel(file, prompt, searchPrompt, maskImagebase64, apiKey) {
    file = base64ToFile(file, "image.png");
    const formData = new FormData();
    let endPoint = "https://api.stability.ai/v2beta/stable-image/edit/remove-background";
    formData.append('image', file);
    if (prompt !== null && searchPrompt !== null) {
        formData.append('prompt', prompt);
        formData.append('search_prompt', searchPrompt);
        endPoint = "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace";
    } else if (maskImagebase64 !== null) {
        maskImagebase64 = base64ToFile(maskImagebase64);
        formData.append('mask', maskImagebase64);
        endPoint = "https://api.stability.ai/v2beta/stable-image/edit/erase";
    }

    try {
        const response = await fetch(endPoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'image/*'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${await response.text()}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        return url;
    } catch (error) {
        console.error('Error during API request:', error);
        throw error;
    }
}

function base64ToFile(base64String, fileName) {
    const byteString = atob(base64String.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: 'image/png' });
    const file = new File([blob], fileName, { type: 'image/png' });

    return file;
}

function setBlazorTimeout(dotNetObject, methodName, delay) {
    setTimeout(() => {
        dotNetObject.invokeMethodAsync(methodName);
    }, delay);
}


// PDF Viewer scripts

function checkClickedDiv() {
    //Check the clicked div is the child of ViewerContainer
    var activeElement = document.activeElement;
    var viewerContainer = document.querySelector('.e-pv-viewer-container');
    return viewerContainer.contains(activeElement);
}
function created() {
    document.getElementById('pdfviewer_open').addEventListener('click', function () {
        document.querySelector('.e-upload-browse-btn').click()
    })
}

function goToPage(referenceNumber) {
    if (window.dotNetObject) {

        if (typeof referenceNumber === 'string') {
            const match = referenceNumber.match(/\d+/);
            referenceNumber = parseInt(match[0], 10);
        }
        window.dotNetObject.invokeMethodAsync('GoToPage', referenceNumber)
            .then(() => {
                console.log('GoToPage called successfully.');
            })
            .catch(error => {
                console.error('Error calling GoToPage:', error);
            });

    } else {
        console.error('dotNetObject is not defined.');
    }
}
function isMobileDevice(isRtl) {
    //Check if the device is mobile
    var isMobile = this.sfBlazor.isDevice(isRtl)
    return isMobile;
}
window.initializeJSInterop = function (dotNetObject) {
    // Store the reference globally or in your desired scope
    window.dotNetObject = dotNetObject;
}
function getPdfPaneHeight() {
    var pdfPane = document.querySelector('.pdfPane')
    if (pdfPane) {
        var pdfPaneRect = pdfPane.getBoundingClientRect();
        if (pdfPaneRect) {
            return pdfPaneRect.height;
        }
    }
}

// PDF Viewer scripts end



/* Diagram scripts start */

function getDiagramFileName(dialogName) {
    if (dialogName === 'export')
        return document.getElementById('diagramName').innerHTML.toString();
    if (dialogName === 'save')
        return document.getElementById('saveFileName').value.toString();
    else
        return document.getElementById('diagramName').innerHTML.toString();
}
function importDescription(formatName) {
    if (formatName === 'CSV') {
        document.getElementById('descriptionText1').innerHTML = "Make sure that each column of the table has a header";
        document.getElementById('descriptionText2').innerHTML = "Each employee should have a reporting person (except the top most employee of the organization), and it should be indicated by any field from the data source.";

    }
    else if (formatName == 'XML') {
        document.getElementById('descriptionText1').innerHTML = "Make sure that XML document has a unique root element and start-tags have matching end-tags.";
        document.getElementById('descriptionText2').innerHTML = "All XML elements will be considered employees and will act as a reporting person for its child XML elements.";

    }
    else {
        document.getElementById('descriptionText1').innerHTML = "Make sure that you have defined a valid JSON format.";
        document.getElementById('descriptionText2').innerHTML = "Each employee should have a reporting person (except the top most employee of the organization), and it should be indicated by any field from the data source.";
    }

}

function getWindowHeight() {
    const viewportHeight = window.innerHeight - 75;
    return viewportHeight;
}
importData = function (object) {
    var orgDataSource = []; var columnsList = []
    orgDataSource = JSON.parse(object);
    var dada = orgDataSource[0];
    for (var prop in dada) { columnsList.push(prop) }
    return columnsList
};

function saveDiagram(data, filename) {
    if (window.navigator.msSaveBlob) {
        let blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
        window.navigator.msSaveOrOpenBlob(blob, filename + '.json');
    } else {
        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
        let a = document.createElement('a');
        a.href = dataStr;
        a.download = filename + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
function loadFile(file) {
    var base64 = file.rawFile.replace("data:application/json;base64,", "");
    var json = atob(base64)
    return json;
}

function downloadFile(data, filename) {
    let dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    let anchorElement = document.createElement('a');
    anchorElement.href = dataString;
    anchorElement.download = filename + '.json';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    anchorElement.remove();
}
UtilityMethods_hideElements = function (elementType, diagramType) {
    var diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
    if (diagramContainer.classList.contains(elementType)) {
        if (!(diagramType === 'mindmap-diagram')) {
            diagramContainer.classList.remove(elementType);
        }
    }
    else {
        diagramContainer.classList.add(elementType);
    }
    if (diagramType) {
        diagramContainer.classList.remove(elementType);
    }
    window.dispatchEvent(new Event('resize'));
    const windowHeight = getWindowHeight();
    return windowHeight;
};
function hideMenubar() {
    UtilityMethods_hideElements('hide-menubar');
}

click = function() {
    document.getElementById('UploadFiles').click();
}
function hideElements(elementType) {
    var diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
    if (diagramContainer.classList.contains(elementType)) {
        diagramContainer.classList.remove(elementType);
    } else {
        diagramContainer.classList.add(elementType);
    }
}

function getElementFromPoint(x, y) {
    return document.elementFromPoint(x, y);
}
UtilityMethods_native = function (object) {
    var selectedItems = JSON.parse(object);
    console.log(selectedItems);
};
function pageSizeUpdate() {
    window.dispatchEvent(new Event('resize'));
}

window.downloadPdf = function downloadPdf(base64String, fileName) {
    var sliceSize = 512;
    var byteCharacters = atob(base64String);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);

        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {
        type: 'application/pdf'
    });
    var blobUrl = window.URL.createObjectURL(blob);
    this.triggerDownload("PDF", fileName, blobUrl);
}

triggerDownload: function triggerDownload(type, fileName, url) {
    var anchorElement = document.createElement('a');
    anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
    anchorElement.href = url;
    anchorElement.click();
}
function getViewportBounds() {
    var bounds = document.getElementsByClassName('e-control e-diagram e-lib e-droppable e-tooltip')[0].getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };

}
window.preventTabDefault = function (textareaId, dotnetRef) {
    const textarea = document.getElementById(textareaId);
    if (textarea)
        textarea.addEventListener('keydown', function (e) {
            const spaceSize = 5;
            const spaces = ' '.repeat(spaceSize);
            const tabCharacter = '\t';
            const isTab = this.value.includes(tabCharacter);
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const value = this.value;

                // Find the current line starting position
                const lineStart = value.lastIndexOf('\n', start - 1) + 1;
                const lineEnd = value.indexOf('\n', start);
                const lineContent = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);

                if (e.shiftKey) {
                    // Removing indentation
                    if (lineContent.startsWith(isTab ? tabCharacter : spaces)) {
                        const removeLength = isTab ? 1 : spaces.length;
                        this.value = value.substring(0, lineStart) + value.substring(lineStart + removeLength);
                        this.selectionStart = this.selectionEnd = start - removeLength;
                    }
                } else {
                    // Adding indentation
                    const indent = isTab ? tabCharacter : spaces;
                    this.value = value.substring(0, lineStart) + indent + value.substring(lineStart);
                    this.selectionStart = this.selectionEnd = start + indent.length;
                }
                dotnetRef.invokeMethodAsync('UpdateTextValue', this.value);
            }
            else if (e.key === 'Enter') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;

                // Getting current line's indentation
                const currentLineStart = this.value.lastIndexOf('\n', start - 1) + 1;
                const currentLineIndentation = this.value.substring(currentLineStart, start).match(/^\s*/)[0];

                // Insert a newline followed by the current line's indentation
                const newText = '\n' + currentLineIndentation;
                this.value = this.value.substring(0, start) + newText + this.value.substring(end);

                // Updating cursor position
                this.selectionStart = this.selectionEnd = start + newText.length;
                dotnetRef.invokeMethodAsync('UpdateTextValue', this.value);
            } else if (e.key === 'Backspace') {
                const start = this.selectionStart;
                const end = this.selectionEnd;
                const currentLineStart = this.value.lastIndexOf('\n', start - 1) + 1;
                const currentLineIndentation = this.value.substring(currentLineStart, start);

                if (currentLineIndentation.endsWith(spaces)) {
                    e.preventDefault();
                    // Removing indentation level
                    this.value = this.value.substring(0, start - spaceSize) + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start - spaceSize;
                    dotnetRef.invokeMethodAsync('UpdateTextValue', this.value);
                }
            }
        });
}

/* Diagram scripts end */