var loginView = {};
$(function() {	
    loginView = new LoginView();
    $("#btnShowCreateLogin").click(function() {loginView.drawCreateLoginScreen();});	
	$("#btnCreateLogin").click(function() {loginView.createLogin();});	
    $("#btnLogin").click(function() {loginView.login();});

    $(".commandButton").click(function() { loginView.buttonPushed(); });
});

function LoginView() {
    var _this = this;
    var maxHeroes = 3;
    var heroView = new HeroView();
    var welcomeMusic = {};
    const cardsEnum = {
        DEER: 0,
        SANTA: 1,
        CANDY_CANE: 2,
        GIFT: 3,
        GRINCH: 4,
        BONBON: 5,
        LOLLIPOP: 6,
        ANGEL: 7,
        GINGERBREAD_MAN: 8,
        XMAS_HAT: 9,
        NUT_CRACKER: 10,
        XMAS_TREE: 11
    };   

    this.buttonPushed = function(event) {
        //var action = event.target.attr("data-action");
        _this.playRound();
    }; 

    this.changeCard = function(cardIndex, cardType) {
        var imgFileName = "deer.jpg";
        if(cardType == cardsEnum.DEER) imgFileName = "deer.jpg";
        if(cardType == cardsEnum.SANTA) imgFileName = "santa.jpg";
        if(cardType == cardsEnum.CANDY_CANE) imgFileName = "candy-cane.jpg";
        if(cardType == cardsEnum.GIFT) imgFileName = "gift.jpg";
        if(cardType == cardsEnum.GRINCH) imgFileName = "grinch.jpg";
        if(cardType == cardsEnum.BONBON) imgFileName = "bonbon.jpg";
        if(cardType == cardsEnum.LOLLIPOP) imgFileName = "lollipop.jpg";
        if(cardType == cardsEnum.ANGEL) imgFileName = "angel.jpg";
        if(cardType == cardsEnum.GINGERBREAD_MAN) imgFileName = "gingerbread-man.jpg";
        if(cardType == cardsEnum.XMAS_HAT) imgFileName = "xmas-hat.jpg";
        if(cardType == cardsEnum.NUT_CRACKER) imgFileName = "nut-cracker.jpg";
        if(cardType == cardsEnum.XMAS_TREE) imgFileName = "xmas-tree.jpg";

        $(".cards .card:nth(" + cardIndex + ") img").attr("src", "./resources/images/xmas/" + imgFileName);
    };

    this.playRoundSuccess = function(response) {        
        var data = response.data;
        _this.changeCard(0, data.card1);
        _this.changeCard(1, data.card2);
        _this.changeCard(2, data.card3);
        data.score;
        $("#totalScore").html(data.totalScore);
        $("#turnsUsed").html(data.turnsUsed + "/" + data.maxTurns);
    };

    this.playRoundFailed = function(data) {
    };

    this.playRound = function() {
        welcomeMusic = soundPlayer.playSound("./resources/sounds/welcome.wav");
        var accessToken = getCookie("accessToken");
        var userGuid = getCookie("userGuid");
        var data = { userName:$("#login").val(), accessToken: accessToken, userGuid: userGuid};
        post("https://xg77iuziq8.execute-api.eu-north-1.amazonaws.com/DEV/xmas-fun-play-round", data, _this.playRoundSuccess, _this.playRoundFailed);
    };

    this.createLogin = function() {
        var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
        post("xmas-fun-create-login", _this.newClientLogin, _this.createLoginSuccess, _this.createLoginFailed);
    };
    
    this.createLoginSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
        drawLoginScreen();
    };
    
    this.createLoginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#statusMessage").html(errorMsg.reason);
    };
    
    this.login = function() {
        welcomeMusic = soundPlayer.playSound("./resources/sounds/welcome.wav");
        var clientLogin = { userName:$("#login").val(), password:$("#password").val() };
        //callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
        post("https://x45nyh9mub.execute-api.eu-north-1.amazonaws.com/DEV/xmas-fun-user-login", clientLogin, loginSuccess, loginFailed);
    };

    this.stopWelcomeMusic = function() {
        soundPlayer.stop(welcomeMusic);
    };

    var drawCards = function(hero) {
        var newHeroCard = $(".hero-card.template").clone();
        newHeroCard.removeClass("template");
        $(newHeroCard).find(".hero-name").html(hero.heroName);
        $(newHeroCard).find(".hero-text").html("");
        $(newHeroCard).find(".card-img-top").attr("src", heroView.getHeroCardImage(hero.heroClass));
        $(newHeroCard).find(".card").attr("data-hero-id", hero.heroId);
        return newHeroCard;
    };

    var addEmptyCard = function() {
        var emptyCard = $(".hero-card-empty.template").clone();
        emptyCard.removeClass("template");        
        $(".cards").append(emptyCard);
    };

    var loginSuccess = function(responseData) {
        logDebug("login OK!");
        logDebug(JSON.stringify(responseData));
        
        $(".function").hide();
        $(".overlay").hide();
        $("#cardContainer").show();
        $("#bottomToolbar").show();
        $("#topToolbar").show();
        
        //document.cookie = "accessToken=" +data.accessToken + ";userGuid=" + "data.userGuid";
        setCookie("accessToken", responseData.data.accessToken, 1);
        setCookie("userGuid", responseData.data.userGuid, 1);
        addEmptyCard();
        addEmptyCard();
        addEmptyCard();
        //var card = drawCards();
        //$(".cards").append(card);
    };
    
    var loginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#loginStatus").html(errorMsg.reason);
    };

    this.drawLoginScreen = function() {
        $(".function").hide();
        $(".overlay").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#loginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
    
    this.drawCreateLoginScreen = function() {
        $(".function").hide();
        $(".overlay").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#createLoginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/xmas/login-background.jpg')"); 
    };
}