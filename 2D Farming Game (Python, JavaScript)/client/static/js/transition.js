function transition(){
    document.getElementById('transitionScreen').style.height = "1px";
    setTimeout(() =>{
        document.getElementById('transitionScreen').style.display = "none";
    }, 299)
}