var loginView = {};
$(function() {	
    loginView = new LoginView();
    $("#btnShowCreateLogin").click(function() {loginView.drawCreateLoginScreen();});	
	$("#btnCreateLogin").click(function() {loginView.createLogin();});	
    $("#btnLogin").click(function() {loginView.login();});

    $(".commandButton").click(function(e, t) { loginView.buttonPushed(e,t); });
});

function LoginView() {
    var _this = this;
    var maxHeroes = 3;
    //var heroView = new HeroView();
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

    this.buttonPushed = function(e,t) {
        var action = $(e.currentTarget).attr("data-action");
        if(action == "playRound") { _this.drawPlayScreen(); _this.playRound(); }
        if(action == "showRewards") _this.showRewards();
        if(action == "showHighScore") _this.showHighScore();
    };

    this.showHighScoreSuccess = function(responseData) {
        var data = responseData.data;
        $(".function").hide();
        $(".overlay").hide();
        $("#highScoreContainer").show();
        $("#bottomToolbar").show();

        $("#highScoreItems").empty();
        var evenRow = true;
        for(var i=0;i<data.length;i++) {
            var newItem = $("#highscoreItemTemplate").clone();
            newItem.removeClass("template");
            newItem.removeAttr("id");
            newItem.find(".highScoreScore").html(data[i].score.N);
            newItem.find(".highScoreName").html(data[i].userName.S);
            //if(evenRow) newItem.addClass("evenRow"); else newItem.addClass("oddRow"); evenRow=!evenRow; 
            $("#highScoreItems").append(newItem);
        }
    };

    this.showHighSshowHighScoreFailedcoreSuccess = function() {

    };

    this.showHighScore = function() {
        logDebug("Showing highscore!");

        var accessToken = getCookie("accessToken");
        var userGuid = getCookie("userGuid");
        var data = { userName:$("#login").val(), accessToken: accessToken, userGuid: userGuid};
        post("https://tt6ew5uusi.execute-api.eu-north-1.amazonaws.com/DEV/xmas-fun-get-high-score", data, _this.showHighScoreSuccess, _this.showHighScoreFailed);
    };

    this.getRewardAmount = function(cardType) {
        if(cardType == cardsEnum.DEER) return "1500/300/70";
        if(cardType == cardsEnum.SANTA) return "500/300/100";
        if(cardType == cardsEnum.CANDY_CANE) return "150/90/30";
        if(cardType == cardsEnum.GIFT) return "100/100/100";
        if(cardType == cardsEnum.GRINCH) return "100/100/100";
        if(cardType == cardsEnum.BONBON) return "100/100/100";
        if(cardType == cardsEnum.LOLLIPOP) return "100/100/100";
        if(cardType == cardsEnum.ANGEL) return "100/100/100";
        if(cardType == cardsEnum.GINGERBREAD_MAN) return "100/100/100";
        if(cardType == cardsEnum.XMAS_HAT) return "100/100/100";
        if(cardType == cardsEnum.NUT_CRACKER) return "100/100/100";
        if(cardType == cardsEnum.XMAS_TREE) return "100/100/100";
        return "-/-/-";
    };

    this.getRewardSpecial = function(cardType) {
        return "N/A";
    };    

    this.showRewards = function() {
        logDebug("Showing rewards!");
        
        $(".function").hide();
        $(".overlay").hide();
        $("#rewardsContainer").show();
        $("#bottomToolbar").show();
        
        $("#rewardItems").empty();
        var evenRow = true;
        for(var cardType=0;cardType<12;cardType++) {
            var newItem = $("#rewardItemTemplate").clone();
            newItem.removeClass("template");
            newItem.removeAttr("id");
            //if(evenRow) newItem.addClass("evenRow"); else newItem.addClass("oddRow"); evenRow=!evenRow;            
            var imgUrl = _this.getImageUrl(cardType);
            newItem.find("img").attr("src", imgUrl);
            newItem.find(".rewardAmount").html(_this.getRewardAmount(cardType));
            newItem.find(".rewardSpecial").html(_this.getRewardSpecial(cardType));

            $("#rewardItems").append(newItem);
        }
    };

    this.getImageUrl = function(cardType) {
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
        return "./resources/images/xmas/" + imgFileName;
    };

    this.changeCard = function(cardIndex, cardType) {
        var imgUrl = _this.getImageUrl(cardType);
        $(".cards .card:nth(" + cardIndex + ") img").attr("src", imgUrl);
    };

    this.playRoundSuccess = function(response) {        
        var data = response.data;
        _this.changeCard(0, data.card1);
        _this.changeCard(1, data.card2);
        _this.changeCard(2, data.card3);
                
        $("#score").html(data.score);
        $("#score").animate("flash");
        $("#totalScore").html(data.totalScore);
        $("#turnsUsed").html(data.turnsUsed + "/" + data.maxTurns);
        $("#turnsUsed").attr("data-turns-used", data.turnsUsed);
        $("#turnsUsed").attr("data-max-turns", data.maxTurns);
    };

    this.playRoundFailed = function(data) {
    };

    this.playRound = function() {
        var turnsUsed = parseInt($("#turnsUsed").attr("data-turns-used"));
        var maxTurns = parseInt($("#turnsUsed").attr("data-max-turns"));

        if(turnsUsed < maxTurns) {
            welcomeMusic = soundPlayer.playSound("./resources/sounds/mix-deck.wav");
            var accessToken = getCookie("accessToken");
            var userGuid = getCookie("userGuid");
            var data = { userName:$("#login").val(), accessToken: accessToken, userGuid: userGuid};
            post("https://xg77iuziq8.execute-api.eu-north-1.amazonaws.com/DEV/xmas-fun-play-round", data, _this.playRoundSuccess, _this.playRoundFailed);
        }
        else {
            log.debug("No turns left, sorry!");
        }
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
        welcomeMusic = soundPlayer.playSound("./resources/sounds/merry-christmas-santa.mp3");
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

    this.drawPlayScreen = function() {
        $(".function").hide();
        $(".overlay").hide();
        $("#cardContainer").show();
        $("#bottomToolbar").show();
        $("#topToolbar").show();
        //var card = drawCards();
        //$(".cards").append(card);
    };

    var loginSuccess = function(responseData) {
        logDebug("login OK!");
        logDebug(JSON.stringify(responseData));
        setCookie("accessToken", responseData.data.accessToken, 1);
        setCookie("userGuid", responseData.data.userGuid, 1);

        addEmptyCard();
        addEmptyCard();
        addEmptyCard();

        _this.drawPlayScreen();
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