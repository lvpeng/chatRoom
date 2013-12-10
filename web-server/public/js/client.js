var pomelo = window.pomelo;
var username;
var users;
var rid;
var base = 1000;
var increase = 25;
var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var LOGIN_ERROR = "There is no server to log in, please wait.";
var LENGTH_ERROR = "Name/Channel is too long or too short. 20 character max.";
var NAME_ERROR = "Bad character in Name/Channel. Can only have letters, numbers, Chinese characters, and '_'";
var DUPLICATE_ERROR = "Please change your name to login.";

// show login panel
function showLogin(){
    $("#loginView").show();
    $("#chatHistory").hide();
    $("#toolbar").hide();
    $("#loginError").hide();
    //$("#pop").hide();  //css -> display:none

    $("#loginUser").focus();
};

// show error
function showError(msg){
    $("#loginError").text(msg);
    $("#loginError").show();
};

function queryEntry(uid, callback){
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init({
        host: window.location.hostname,
        port: 3014,
        log : true
    }, function(){
        pomelo.request(route,{uid:uid},function(){

        });
    });
};

$(document).ready(function(){
    //when first time into chat room.
    showLogin();

    //deal with login button click.
    $("#login").click(function(){
        username = $("#loginUser").attr("value");
        rid = $("#channelList").val();

        if(username.length > 20 || username.length == 0 || rid.length > 20 || rid.length ==0 ){
            showError(LENGTH_ERROR);
            return false;
        }

        if(!reg.test(username) || !reg.test(rid)){
            showError(NAME_ERROR);
            return false;
        }

        //query entry of connection
        queryEntry(username,function(host,port){
            pomelo.init({
                host:host,
                port:port,
                log:true
            },function(){
                var route = "connector.entryHandler.enter";
                pomelo.request(route,{
                    username:username,
                    rid:rid
                }, function(data){
                    if(data.error){
                        showError(DUPLICATE_ERROR);
                        return;
                    }

                });
            });
        });

    });
});