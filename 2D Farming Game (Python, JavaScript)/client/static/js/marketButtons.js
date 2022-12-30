function seedIncrement(seedCountId){
    let seedCount = document.getElementById(seedCountId);
    let marketMenuRightTotal = document.getElementById('marketMenuRightTotal');
    if(seedCount.value < seedCount.max){
        seedCount.value++;
        let currentTotal = parseInt(marketMenuRightTotal.innerHTML);
        let newTotal = currentTotal + parseInt(seedCount.getAttribute("cost"));
        if(newTotal > 0){
            marketMenuRightTotal.style.color = "red";
        }
        else{
            marketMenuRightTotal.style.color = "white";
        }

        marketMenuRightTotal.innerHTML = newTotal;
    }
};
function seedDecrement(seedCountId){
    let seedCount = document.getElementById(seedCountId);
    let marketMenuRightTotal = document.getElementById('marketMenuRightTotal');
    if(seedCount.value > 0){
        seedCount.value--;
        let currentTotal = parseInt(marketMenuRightTotal.innerHTML);
        let newTotal = currentTotal - parseInt(seedCount.getAttribute("cost"));
        if(newTotal > 0){
            marketMenuRightTotal.style.color = "red";
        }
        else{
            marketMenuRightTotal.style.color = "white";
        }
        marketMenuRightTotal.innerHTML = newTotal;
    }
};
function cropIncrement(cropCountId){
    let cropCount = document.getElementById(cropCountId);
    let marketMenuLeftTotal = document.getElementById('marketMenuLeftTotal');
    if(cropCount.value < cropCount.max){
        cropCount.value++;
        let currentTotal = parseInt(marketMenuLeftTotal.innerHTML);
        let newTotal = currentTotal + parseInt(cropCount.getAttribute("cost"));
        if(newTotal > 0){
            marketMenuLeftTotal.style.color = "green";
        }
        else{
            marketMenuLeftTotal.style.color = "white";
        }
        marketMenuLeftTotal.innerHTML = newTotal;
    }
};
function cropDecrement(cropCountId){
    let cropCount = document.getElementById(cropCountId);
    let marketMenuLeftTotal = document.getElementById('marketMenuLeftTotal');
    if(cropCount.value > 0){
        cropCount.value--;
        let currentTotal = parseInt(marketMenuLeftTotal.innerHTML);
        let newTotal = currentTotal - parseInt(cropCount.getAttribute("cost"));
        if(newTotal > 0){
            marketMenuLeftTotal.style.color = "green";
        }
        else{
            marketMenuLeftTotal.style.color = "white";
        }
        marketMenuLeftTotal.innerHTML = newTotal;
    }
};