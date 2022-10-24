


document
    .getElementById("selectPort")
    .addEventListener('click', async () =>{
    await selectPort();
});

document
    .getElementById("copyToClipboard")
    .addEventListener('click', () => {
        var textArea = document.querySelector("#logArea");
        if (!document && !navigator) {
            return;
        }

        navigator.clipboard
            .writeText(textArea.value)
            .then(() => {
              console.log("OK");
            })
            .catch((err) => {
              console.groupCollapsed(
                '[utils/toClipboard]: Could not copy to clipboard.'
              );
              console.warn(err);
              console.groupEnd();
            });
    });


var port;

async function selectPort ()
{
    if(port !== null)
    {
       closePort();
    }
    if(  !("serial" in navigator)  )
    {
        alert("Navegador não e compativel");
        return;
    }
    port = await navigator.serial.requestPort();
    await port.open({baudRate:9600});
    window.addEventListener("beforeunload", function (ev) {
        closePort();
        ev.returnValue = "Chrome/Blink/Webkit";
        return "Firefox/IE";
    });
    readSerialPort2 ();
}


async function closePort()
{
    // await port.close();
}

async function readSerialPort ()
{

    while(port.readable)
    {
        // const reader = port.readable.getReader();
        const decoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        const reader = inputStream.getReader();

        try{
            while(true){
                const {value, done} = await reader.read();
                console.log(done);
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    break;
                }
                if(value) {
                    console.log(value);
                    var textArea = document.getElementById("logArea");
                    textArea.value += value + "\n";
                    textArea.scrollTop = textArea.scrollHeight;
                    parseProtocol(value);
                }
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
}


function parseProtocol(protocol)
{
    let weight;
    if(protocol.length == 18)
    {
        weight = protocol.substring(4,13);
    }
    if(protocol.length == 11)
    {
        weight = protocol.substring(1,7);
    }

    document.getElementById("weight-text").value = weight + ' Kg';
}




async function readSerialPort2 ()
{
    var qualquer_nome =[];

    while(port.readable)
    {
        // const reader = port.readable.getReader();
        const decoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        const reader = inputStream.getReader();

        try{
            while(true){
                const {value, done} = await reader.read();
                console.log(done);
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    break;
                }
                console.log(value);
                if(value) {
                    qualquer_nome.push(value);
                }
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
    var textArea = document.getElementById("logArea");
    textArea.value += qualquer_nome.join('') + "\n";
    textArea.scrollTop = textArea.scrollHeight;
    parseProtocol(value);
}
