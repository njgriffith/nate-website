function toggleFont(){
    const body = document.body;
    if (body.style.fontFamily.toString().includes("Pixelated")){
        body.style.fontFamily = "Arial, Helvetica, sans-serif";
        return;
    }
    body.style.fontFamily = "Pixelated MS Sans Serif";
}