if(window.innerWidth <= 1366){
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
            if(window.scrollY >= 30){
                document.getElementById("navbar").style.top = "-55px";
            }else{
                document.getElementById("navbar").style.top = "25px";
            }
        }
    }