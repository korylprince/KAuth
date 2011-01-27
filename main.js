$(document).ready(function() {
    $("#returnboxwrapper").fadeOut(0);
    //set password to blank and keep password and text the same
    $('[name="passwordtext"]').val("");
    $('[name="password"]').val("");
    if($('[name="showpassword"]').attr("checked")) {
        $('[name="password"]').hide();
        $('[name="passwordtext"]').show();
    }
    else {
        $('[name="password"]').show();
        $('[name="passwordtext"]').hide();
    }
    $("#submitbutton").button();
    $('input').click(function() {
        $(this).not("button").removeClass("ui-state-default");
        $(this).not("button").addClass("ui-state-active");
    });
    $('input').blur(function() {
        $(this).not("button").addClass("ui-state-default");
        $(this).not("button").removeClass("ui-state-active");
    });
    $('[name="showpassword"]').change(function() {
        if($(this).attr("checked")) {
            $('[name="password"]').hide();
            $('[name="passwordtext"]').show();
            $('[name="passwordtext"]').val($('[name="password"]').val());
        }
        else {
            $('[name="password"]').show();
            $('[name="passwordtext"]').hide();
            $('[name="password"]').val($('[name="passwordtext"]').val());
        }
    });
    $('#submitbutton').click(function() {
        if($('[name="showpassword"]').attr("checked")) {
            $('[name="password"]').val($('[name="passwordtext"]').val());
        }
        submit({"username":$('[name="username"]').val(),"password":$('[name="password"]').val()},null);
    });
});


//Post to login.php
function submit(jsondata, sessionID) {
    if(sessionID){
        var jsondata = {"sessionID":sessionID};
    }
    $.ajax({
        type: "POST",
        url: "auth/login.php",
        data: jsondata,
        dataType: "json",
        success: function(returndata){
            //if sessionID is returned create session button
            if(returndata.data) {
                if(returndata.data.sessionID) {
                    $(".sessionremove").remove();
                    $("#loginbox").append("<br class='sessionremove'/><button id='sessionbutton' class='sessionremove'>Use Session</button><br class='sessionremove'/><button id='logoutbutton' class='sessionremove'>Logout</button>");
                    $("#sessionbutton").button();$("#logoutbutton").button();
                    $("#sessionbutton").hide();$("#logoutbutton").hide();
                    $("#sessionbutton").fadeIn();$("#logoutbutton").fadeIn();
                    $("#sessionbutton").click(function(){submit(null,returndata.data.sessionID);});
                    $("#logoutbutton").click(function(){submit({"options":["sessionLogout"]},null);$(".sessionremove").remove();});
                }
            }
            //create json output box
            $("#returnboxwrapper").fadeOut(500,function(){$("#returnbox").html(jsonPrettier(returndata));});
            $("#returnboxwrapper").fadeIn(1000);
            $("#returnboxwrapper").draggable();
        },
        error: function() {
            alert("Error!");
        }
    });
}

//function to output "pretty" json
function jsonPrettier(json) {
    var string = JSON.stringify(json);
    string = string.replace(/\[/g,"<div class='jsonblock'><span class='character'>[</span><div class ='indent'><div class='pair'><span class='key'>");
    string = string.replace(/\]/g,"</span></div></div><span class='character'>]</span></div>");
    string = string.replace(/:/g,"</span><span class='colon'>:</span><span class='value'>");
    string = string.replace(/,/g,"</span><span class='character'>,</span></div><div class='pair'><span class='key'>");
    string = string.replace(/{/g,"<div class='jsonblock'><span class='character'>{</span><div class ='indent'><div class='pair'><span class='key'>");
    string = string.replace(/}/g,"</span></div></div><span class='character'>}</span></div>");
    var re = new RegExp("}</span></div></span><span class='character'>,</span>", "g");
    string = string.replace(re,"},</span></div></span>");
    var re = new RegExp("]</span></div></span><span class='character'>,</span>", "g");
    string = string.replace(re,"],</span></div></span>");
    return string;
}
